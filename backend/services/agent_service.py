import asyncio
import base64
import logging
import os
import sys
import uuid
from datetime import datetime
from typing import Optional, AsyncIterator
import json

logger = logging.getLogger(__name__)

# Ensure parent src/ is importable
_root = os.path.join(os.path.dirname(__file__), "..", "..")
if _root not in sys.path:
    sys.path.insert(0, _root)

from models.agent import AgentRunRequest, AgentStatus, AgentStep

class AgentService:
    def __init__(self):
        self._is_running = False
        self._is_paused = False
        self._current_step = 0
        self._max_steps = 100
        self._status = "idle"
        self._task_id: Optional[str] = None
        self._task: Optional[asyncio.Task] = None
        self._steps: list[AgentStep] = []
        self._result: Optional[str] = None
        self._error: Optional[str] = None
        self._event_queue: asyncio.Queue = asyncio.Queue()
        self._browser = None
        self._browser_context = None
        self._agent = None

    def get_status(self) -> AgentStatus:
        return AgentStatus(
            is_running=self._is_running,
            is_paused=self._is_paused,
            current_step=self._current_step,
            max_steps=self._max_steps,
            status=self._status,
            task_id=self._task_id,
        )

    async def run(self, request: AgentRunRequest) -> str:
        if self._is_running:
            raise RuntimeError("Agent is already running")

        task_id = str(uuid.uuid4())
        self._task_id = task_id
        self._is_running = True
        self._is_paused = False
        self._current_step = 0
        self._max_steps = request.agent.max_steps
        self._status = "running"
        self._steps = []
        self._result = None
        self._error = None

        self._task = asyncio.create_task(self._run_agent(request))
        return task_id

    async def stop(self):
        self._status = "stopping"
        if self._agent and hasattr(self._agent, "stop"):
            self._agent.stop()
        if self._task:
            self._task.cancel()
        await self._cleanup()

    async def pause(self):
        self._is_paused = True
        self._status = "paused"
        if self._agent and hasattr(self._agent, "pause"):
            self._agent.pause()
        await self._event_queue.put({"type": "status", "status": "paused"})

    async def resume(self):
        self._is_paused = False
        self._status = "running"
        if self._agent and hasattr(self._agent, "resume"):
            self._agent.resume()
        await self._event_queue.put({"type": "status", "status": "running"})

    async def get_events(self) -> AsyncIterator[dict]:
        while True:
            try:
                event = await asyncio.wait_for(self._event_queue.get(), timeout=30)
                yield event
                if event.get("type") in ("agent_output", "error"):
                    break
            except asyncio.TimeoutError:
                yield {"type": "ping"}

    async def _cleanup(self):
        self._is_running = False
        self._status = "idle"
        try:
            if self._browser_context and hasattr(self._browser_context, 'context'):
                await self._browser_context.context.close()
        except Exception:
            pass
        try:
            if self._browser:
                await self._browser.close()
        except Exception:
            pass
        self._browser = None
        self._browser_context = None
        self._agent = None

    async def _emit(self, event: dict):
        await self._event_queue.put(event)

    async def _run_agent(self, request: AgentRunRequest):
        try:
            from src.utils.llm_provider import get_llm_model
            from browser_use.browser.browser import Browser, BrowserConfig as BUBrowserConfig
            from browser_use.browser.context import BrowserContext, BrowserContextConfig
            from src.controller.custom_controller import CustomController
            from src.agent.browser_use.browser_use_agent import BrowserUseAgent

            # Enhance task with structured-output guidance for extraction tasks
            task_text = request.task
            extract_keywords = ("extract", "list", "table", "scrape", "collect", "get all", "fetch all", "find all", "gather")
            if any(kw in request.task.lower() for kw in extract_keywords):
                task_text = (
                    f"{request.task}\n\n"
                    "IMPORTANT OUTPUT INSTRUCTIONS: When you finish, use the 'done' action and return "
                    "the extracted data as a valid JSON array of objects in the 'text' field. "
                    "Each object should represent one item with consistent keys (e.g. name, price, rating, url). "
                    "Extract ALL matching items found on the page, not just a few. "
                    "If the user asked for a specific format, still include the raw JSON data so it can be rendered as a table."
                )

            llm = get_llm_model(
                provider=request.llm.provider,
                model_name=request.llm.model_name,
                temperature=request.llm.temperature,
                base_url=request.llm.base_url,
                api_key=request.llm.api_key,
                num_ctx=request.llm.num_ctx,
            )

            # Browser settings come from the request (frontend Settings → Browser)
            from browser_use.browser.context import BrowserContextConfig as BUContextConfig

            win_w = request.browser.window_width or 1920
            win_h = request.browser.window_height or 1080

            context_config = BUContextConfig(
                window_width=win_w,
                window_height=win_h,
                no_viewport=False,  # Force a fixed viewport at the given size for full-page rendering
                save_recording_path="./tmp/recordings" if request.agent.enable_recording else None,
            )

            browser_config = BUBrowserConfig(
                headless=request.browser.headless,
                disable_security=request.browser.disable_security,
                cdp_url=request.browser.cdp_url if request.browser.cdp_url else None,
                wss_url=request.browser.wss_url if request.browser.wss_url else None,
                chrome_remote_debugging_port=9223,
                new_context_config=context_config,
                extra_chromium_args=[
                    f"--window-size={win_w},{win_h}",
                    "--no-first-run",
                    "--no-default-browser-check",
                    "--disable-popup-blocking",
                ],
            )
            self._browser = Browser(config=browser_config)

            self._controller = CustomController()

            # Let the agent create its own context internally - prevents duplicate windows
            self._agent = BrowserUseAgent(
                task=task_text,
                llm=llm,
                browser=self._browser,
                controller=self._controller,
                use_vision=request.agent.use_vision,
                max_actions_per_step=request.agent.max_actions_per_step,
                tool_calling_method=request.agent.tool_calling_method,
                max_input_tokens=request.agent.max_input_tokens,
                enable_memory=False,  # Disable mem0 - it requires OPENAI_API_KEY for embeddings
            )
            # Get reference to the context after agent creates it
            self._browser_context = self._agent.browser_context

            # Explicitly launch the browser session now so any launch errors surface clearly
            try:
                session = await self._browser_context.get_session()
                pw_context = session.context
                logger.info(f"Browser launched (headless={request.browser.headless}, {win_w}x{win_h})")
            except Exception as e:
                logger.exception("Failed to launch browser")
                raise RuntimeError(f"Browser failed to launch: {e}")

            # Inject a visible cursor that follows real mouse movements/clicks.
            # Playwright performs genuine mouse actions, so this cursor reflects
            # the actual element being clicked - captured in the screenshot stream.
            try:
                from services.cursor_script import CURSOR_INIT_SCRIPT
                await pw_context.add_init_script(CURSOR_INIT_SCRIPT)
                # Also inject into any already-open pages
                for page in pw_context.pages:
                    try:
                        await page.evaluate(CURSOR_INIT_SCRIPT)
                    except Exception:
                        pass
                logger.info("Cursor overlay injected into browser context")
            except Exception as e:
                logger.warning(f"Could not inject cursor overlay: {e}")

            async def on_step_end(agent_instance):
                step_num = agent_instance.state.n_steps
                history = agent_instance.state.history
                screenshot_b64 = None
                try:
                    if self._browser_context:
                        page = await self._browser_context.get_current_page()
                        screenshot_bytes = await page.screenshot()
                        screenshot_b64 = base64.b64encode(screenshot_bytes).decode()
                except Exception:
                    pass

                last_action = ""
                last_result = ""
                if history.history:
                    last = history.history[-1]
                    if last.model_output and last.model_output.action:
                        last_action = str(last.model_output.action[0]) if last.model_output.action else ""
                    if last.result:
                        last_result = str(last.result[-1]) if last.result else ""

                step = AgentStep(
                    step=step_num,
                    action=last_action,
                    result=last_result,
                    timestamp=datetime.now().isoformat(),
                    screenshot=screenshot_b64,
                )
                self._steps.append(step)
                self._current_step = step_num

                await self._emit({
                    "type": "agent_step",
                    "step": step_num,
                    "action": last_action,
                    "result": last_result,
                    "timestamp": step.timestamp,
                })
                if screenshot_b64:
                    url = ""
                    try:
                        if self._browser_context:
                            page = await self._browser_context.get_current_page()
                            url = page.url
                    except Exception:
                        pass
                    await self._emit({
                        "type": "browser_state",
                        "screenshot": screenshot_b64,
                        "url": url,
                    })

            # Background screenshot capture every 500ms for smooth browser view
            async def _screenshot_loop():
                while self._is_running:
                    try:
                        await asyncio.sleep(0.5)
                        if not self._is_running or not self._browser_context:
                            break
                        page = await self._browser_context.get_current_page()
                        screenshot_bytes = await page.screenshot()
                        screenshot_b64 = base64.b64encode(screenshot_bytes).decode()
                        url = page.url
                        await self._emit({
                            "type": "browser_state",
                            "screenshot": screenshot_b64,
                            "url": url,
                        })
                    except asyncio.CancelledError:
                        break
                    except Exception:
                        await asyncio.sleep(1)

            screenshot_task = asyncio.create_task(_screenshot_loop())

            history = await self._agent.run(
                max_steps=request.agent.max_steps,
                on_step_end=on_step_end,
            )

            screenshot_task.cancel()

            result = history.final_result() if history else "Task completed."
            self._result = result
            self._status = "completed"
            await self._emit({"type": "agent_output", "result": result})

        except asyncio.CancelledError:
            self._status = "stopped"
            await self._emit({"type": "status", "status": "stopped"})
        except Exception as e:
            self._error = str(e)
            self._status = "error"
            logger.exception("Agent error")
            await self._emit({"type": "error", "message": str(e)})
        finally:
            self._is_running = False
            await self._cleanup()
