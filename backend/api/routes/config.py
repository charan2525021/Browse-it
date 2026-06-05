from fastapi import APIRouter
from models.config import ConfigUpdateRequest, ConfigResponse
import os

router = APIRouter()

@router.get("/all", response_model=ConfigResponse)
async def get_all_config():
    config = {
        "llm": {
            "openai_api_key": bool(os.getenv("OPENAI_API_KEY")),
            "anthropic_api_key": bool(os.getenv("ANTHROPIC_API_KEY")),
            "google_api_key": bool(os.getenv("GOOGLE_API_KEY")),
        },
        "browser": {
            "chrome_persistent_session": os.getenv("CHROME_PERSISTENT_SESSION", "false"),
            "resolution": os.getenv("RESOLUTION", "1920x1080x24"),
        },
    }
    return ConfigResponse(config=config)

@router.put("/update")
async def update_config(req: ConfigUpdateRequest):
    return {"message": f"Updated {req.section}.{req.key}", "value": req.value}
