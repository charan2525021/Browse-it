from pydantic import BaseModel
from typing import Optional

class BrowserAction(BaseModel):
    action: str
    params: dict = {}

class BrowserState(BaseModel):
    url: str = ""
    title: str = ""
    screenshot: Optional[str] = None
    is_connected: bool = False
