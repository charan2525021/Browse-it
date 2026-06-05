import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import agent, browser, config, llm, recording
from api.websocket.agent_ws import router as ws_router
from core.config import settings

app = FastAPI(title="Browser Use API", version="1.0.0", description="Browser automation AI agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent.router,     prefix="/api/agent",     tags=["agent"])
app.include_router(browser.router,   prefix="/api/browser",   tags=["browser"])
app.include_router(config.router,    prefix="/api/config",    tags=["config"])
app.include_router(llm.router,       prefix="/api/llm",       tags=["llm"])
app.include_router(recording.router, prefix="/api/recording", tags=["recording"])
app.include_router(ws_router)

@app.get("/health")
async def health():
    return {"status": "ok"}
