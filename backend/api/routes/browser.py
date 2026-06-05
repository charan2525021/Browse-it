from fastapi import APIRouter
from models.browser import BrowserAction, BrowserState
from core.dependencies import get_agent_service

router = APIRouter()

@router.get("/screenshot")
async def get_screenshot():
    svc = get_agent_service()
    if svc._browser_context:
        from services.browser_service import BrowserService
        bs = BrowserService()
        screenshot = await bs.get_screenshot(svc._browser_context)
        if screenshot:
            return {"screenshot": screenshot}
    return {"screenshot": None}

@router.get("/state", response_model=BrowserState)
async def get_state():
    svc = get_agent_service()
    state = BrowserState()
    if svc._browser_context:
        try:
            page = await svc._browser_context.get_current_page()
            state.url = page.url
            state.title = await page.title()
            state.is_connected = True
        except Exception:
            pass
    return state
