from pydantic import BaseModel
from typing import Optional, List, Any
from enum import Enum

class AgentType(str, Enum):
    BROWSER_USE = "browser_use"
    DEEP_RESEARCH = "deep_research"

class LLMConfig(BaseModel):
    provider: str = "openai"
    model_name: str = "gpt-4o"
    temperature: float = 1.0
    base_url: Optional[str] = None
    api_key: Optional[str] = None
    num_ctx: Optional[int] = None

class BrowserConfig(BaseModel):
    headless: bool = False
    disable_security: bool = True
    window_width: int = 1280
    window_height: int = 1100
    use_own_browser: bool = False
    chrome_instance_path: Optional[str] = None
    cdp_url: Optional[str] = None
    wss_url: Optional[str] = None

class AgentConfig(BaseModel):
    max_steps: int = 100
    max_actions_per_step: int = 10
    use_vision: bool = False
    tool_calling_method: str = "auto"
    max_input_tokens: int = 128000
    enable_recording: bool = False

class AgentRunRequest(BaseModel):
    task: str
    agent_type: AgentType = AgentType.BROWSER_USE
    llm: LLMConfig = LLMConfig()
    browser: BrowserConfig = BrowserConfig()
    agent: AgentConfig = AgentConfig()
    add_infos: Optional[str] = None
    mcp_server_config: Optional[dict] = None

class AgentStatus(BaseModel):
    is_running: bool
    is_paused: bool
    current_step: int
    max_steps: int
    status: str
    task_id: Optional[str] = None

class AgentRunResponse(BaseModel):
    task_id: str
    status: str
    message: str

class AgentStep(BaseModel):
    step: int
    action: str
    result: str
    timestamp: str
    screenshot: Optional[str] = None

class AgentHistoryResponse(BaseModel):
    task_id: str
    task: str
    steps: List[AgentStep]
    result: Optional[str] = None
    status: str
