"""
Planner service - generates an explicit, human-readable execution plan before
the agent starts browsing. This makes the agent's reasoning visible ("smart
enough to plan") and gives the user a chance to see what will happen.
"""
import json
import logging
from typing import List

logger = logging.getLogger(__name__)

PLANNER_SYSTEM_PROMPT = """You are a planning assistant for an autonomous web browsing agent.
Given a user's task, break it into a clear, ordered list of high-level steps the agent will perform in a web browser.

Rules:
- Return ONLY a JSON array of step strings, nothing else.
- Each step should be a concise, actionable instruction (max 12 words).
- Include navigation, interaction, extraction, and verification steps.
- Aim for 3-8 steps. Be realistic about what a browser agent can do.

Example output:
["Navigate to the target website", "Search for the requested item", "Open the most relevant result", "Extract the required details", "Verify and return the data"]
"""


async def generate_plan(llm, task: str) -> List[str]:
    """Generate an ordered list of plan steps for the given task."""
    try:
        from langchain_core.messages import SystemMessage, HumanMessage

        messages = [
            SystemMessage(content=PLANNER_SYSTEM_PROMPT),
            HumanMessage(content=f"Task: {task}\n\nReturn the plan as a JSON array of step strings."),
        ]
        response = await llm.ainvoke(messages)
        content = response.content if hasattr(response, "content") else str(response)

        # Extract JSON array from the response
        start = content.find("[")
        end = content.rfind("]")
        if start >= 0 and end > start:
            steps = json.loads(content[start:end + 1])
            if isinstance(steps, list) and all(isinstance(s, str) for s in steps):
                return steps[:10]
    except Exception as e:
        logger.warning(f"Planner failed, using fallback: {e}")

    # Fallback generic plan
    return [
        "Analyze the task and identify the target website",
        "Navigate to the website",
        "Locate the relevant elements or information",
        "Perform the required actions",
        "Extract and return the results",
    ]
