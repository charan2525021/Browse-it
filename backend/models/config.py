from pydantic import BaseModel
from typing import Any, Dict

class ConfigUpdateRequest(BaseModel):
    section: str
    key: str
    value: Any

class ConfigResponse(BaseModel):
    config: Dict[str, Any]
