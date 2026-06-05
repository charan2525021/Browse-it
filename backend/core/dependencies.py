from services.agent_service import AgentService

_agent_service: AgentService | None = None

def get_agent_service() -> AgentService:
    global _agent_service
    if _agent_service is None:
        _agent_service = AgentService()
    return _agent_service
