from fastapi import APIRouter
from services.llm_service import get_providers, test_llm
from pydantic import BaseModel

router = APIRouter()

class LLMTestRequest(BaseModel):
    provider: str
    model_name: str
    api_key: str = ""

@router.get("/providers")
async def list_providers():
    return {"providers": get_providers()}

@router.post("/test")
async def test_llm_connection(req: LLMTestRequest):
    result = test_llm(req.provider, req.model_name, req.api_key)
    return result
