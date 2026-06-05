from fastapi import APIRouter, HTTPException
from models.agent import AgentRunRequest, AgentRunResponse, AgentStatus
from core.dependencies import get_agent_service

router = APIRouter()

@router.post("/run", response_model=AgentRunResponse)
async def run_agent(request: AgentRunRequest):
    svc = get_agent_service()
    if svc.get_status().is_running:
        raise HTTPException(400, "Agent is already running")
    task_id = await svc.run(request)
    return AgentRunResponse(task_id=task_id, status="running", message="Agent started")

@router.post("/stop")
async def stop_agent():
    svc = get_agent_service()
    await svc.stop()
    return {"message": "Agent stopped"}

@router.post("/pause")
async def pause_agent():
    svc = get_agent_service()
    await svc.pause()
    return {"message": "Agent paused"}

@router.post("/resume")
async def resume_agent():
    svc = get_agent_service()
    await svc.resume()
    return {"message": "Agent resumed"}

@router.get("/status", response_model=AgentStatus)
async def get_status():
    return get_agent_service().get_status()

@router.get("/history")
async def get_history():
    svc = get_agent_service()
    return {
        "task_id": svc._task_id,
        "steps": [s.model_dump() for s in svc._steps],
        "result": svc._result,
        "status": svc._status,
    }
