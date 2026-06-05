import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.dependencies import get_agent_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/ws/agent")
async def agent_websocket(websocket: WebSocket):
    await websocket.accept()
    svc = get_agent_service()
    try:
        while True:
            try:
                event = await asyncio.wait_for(svc._event_queue.get(), timeout=20)
                await websocket.send_text(json.dumps(event))
            except asyncio.TimeoutError:
                await websocket.send_text(json.dumps({"type": "ping"}))
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
