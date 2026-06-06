# Browse-it

![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Automation](https://img.shields.io/badge/Automation-Agentic%20Web-FF6B35?style=for-the-badge&logo=googlechrome&logoColor=white)
![LLM Ready](https://img.shields.io/badge/LLM-Multi%20Provider-7B61FF?style=for-the-badge&logo=openai&logoColor=white)

## What is Browse-it?

Browse-it is an Agentic Web workspace for running AI agents that can browse, inspect, extract, and interact with websites on a user's behalf.

It combines:
- A FastAPI backend that runs browser agents, streams live events over WebSocket, and exposes browser, config, history, and recording endpoints.
- A React + Vite frontend that lets users launch tasks, watch browser progress live, switch agent modes, and tune LLM, browser, and execution settings.

This project is built around the core Agentic Web idea: give the agent a goal in natural language, let it plan, act step by step, recover through multi-step flows, and show the user exactly what is happening.

<img width="1903" height="818" alt="image" src="https://github.com/user-attachments/assets/ac59d1ce-645c-4c48-a8b9-7aba52986118" />

## What Browse-it can do

- Run natural-language browser tasks end to end through a Browser Agent.
- Run a Deep Research mode for research-oriented tasks.
- Generate a plan before execution and stream plan steps back to the UI.
- Navigate websites, inspect live browser state, and stream screenshots in near real time.
- Pause, resume, or stop long-running agent sessions.
- Extract structured data for scraping, listing, comparison, and table-style outputs.
- Summarize gathered web content into readable final answers.
- Record browser sessions and list saved recordings from the backend.
- Keep local task history with step-by-step execution traces.
- Connect to multiple LLM providers and tune behavior for reliability, speed, privacy, or cost.
- Connect to an existing Chromium session using CDP when needed.

Typical use cases:
- Web research and page summarization.
- Data extraction from lists, directories, tables, and product pages.
- Browser testing and validation flows.
- Form-filling and multi-step web workflows.
- Human-in-the-loop automation where the user monitors and intervenes only when needed.

<img width="1908" height="855" alt="image" src="https://github.com/user-attachments/assets/4a395686-85f1-47e2-8489-43f8d45bc6e1" />

## Product highlights

### Agent modes
- Browser Agent: general-purpose browser execution for navigation, interaction, extraction, and task completion.
- Deep Research: a research-focused mode exposed in the UI for longer-form information gathering.

### Live execution visibility
- WebSocket-driven event streaming for status, plan updates, step logs, and browser screenshots.
- Browser view with current URL and live screenshot updates.
- Result panel, plan panel, and step timeline during execution.

### Runtime controls
- Start, pause, resume, and stop controls.
- Progress tracking by current step vs. max steps.
- Optional planning before acting.
- Optional session recording to `backend/tmp/recordings`.

### Configuration surface
- LLM provider, model, API key, base URL, and temperature.
- Browser headless mode, security relaxation, viewport size, and CDP connection.
- Agent limits such as max steps, max actions per step, max input tokens, tool-calling method, and vision support.

### Multi-provider LLM support
The frontend already exposes these providers:
- OpenAI
- Anthropic
- Google Gemini
- Groq
- DeepSeek
- Ollama
- Azure OpenAI
- Mistral
- Alibaba Qwen
- Moonshot AI
- SiliconFlow
- ModelScope

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand, React Router
- Backend: FastAPI, Pydantic, WebSocket streaming
- Browser automation: Playwright and browser-use based agent orchestration
- AI model layer: pluggable multi-provider LLM configuration

## Project structure

```text
backend/
  api/
    routes/        # agent, browser, config, llm, recording endpoints
    websocket/     # live agent event streaming
  services/        # agent execution, planner, browser, llm services
  models/          # request/response schemas
  src/             # custom browser, controller, agent integrations

frontend/
  src/
    pages/         # home, agent, settings, history
    components/    # agent UI, browser view, settings panels, layout
    hooks/         # agent actions, config state, websocket sync
    store/         # UI, config, history, and runtime state
    api/           # HTTP and websocket clients
```

## Installation

### Backend setup on Windows
1. Open a terminal in the repository root and go to the backend folder.
   ```powershell
   cd backend
   ```
2. Create and activate a virtual environment.
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
3. Install Python dependencies.
   ```powershell
   install.bat
   ```
   Or:
   ```powershell
   pip install -r requirements.txt
   ```
4. Install Playwright browser binaries.
   ```powershell
   playwright install chromium
   ```
5. Create a `backend/.env` file and add the keys you want to use.
   ```env
   OPENAI_API_KEY=
   ANTHROPIC_API_KEY=
   GOOGLE_API_KEY=
   AZURE_OPENAI_API_KEY=
   AZURE_OPENAI_ENDPOINT=
   DEEPSEEK_API_KEY=
   OLLAMA_BASE_URL=http://localhost:11434
   CHROME_PERSISTENT_SESSION=false
   RESOLUTION=1920x1080x24
   CORS_ORIGINS_STR=http://localhost:5173
   ```

### Frontend setup
1. Open another terminal and go to the frontend folder.
   ```powershell
   cd frontend
   ```
2. Install dependencies.
   ```powershell
   npm install
   ```
3. If your backend runs somewhere else, set the frontend API URL before starting Vite.
   ```powershell
   $env:VITE_API_URL="http://localhost:8000"
   ```

## Run locally

### Start the backend
From the `backend` folder with the virtual environment active:

```powershell
python run.py
```

Alternative:

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend default URL: `http://localhost:8000`

### Start the frontend
From the `frontend` folder:

```powershell
npm run dev
```

Frontend default URL: `http://localhost:5173`

## How the app works

1. The user chooses an agent mode and enters a natural-language task.
2. The frontend sends the task and runtime configuration to the FastAPI backend.
3. The backend initializes the selected agent, configures the browser, and optionally generates a plan first.
4. Execution events are streamed back through WebSocket.
5. The UI updates live with status, plan steps, screenshots, browser state, intermediate steps, and final output.
6. When enabled, recordings are saved and task history is preserved in the frontend state.

## Configuration guide

### LLM settings
- Provider: selects the model backend.
- Model: model or deployment name to use.
- API Key: provider credential.
- Base URL: optional custom or self-hosted endpoint.
- Temperature: controls determinism vs. creativity.

Recommended defaults:
- Best general reliability: OpenAI GPT-4o class models.
- Enterprise deployment path: Azure OpenAI GPT-4o class deployments.
- Good speed and cost balance: Gemini 2.0 Flash class models.
- Local/offline experimentation: Ollama.

### Browser settings
- Headless Mode: run without a visible window.
- Disable Security: relax browser restrictions for difficult flows.
- Width and Height: control viewport size.
- CDP URL: attach to an existing Chromium instance.

### Agent settings
- Max Steps: total decision budget.
- Actions per Step: browser/tool actions allowed in one cycle.
- Max Input Tokens: model context budget.
- Tool Method: `auto`, `function_calling`, or `raw`.
- Use Vision: enable screenshot-aware reasoning.
- Recording: save browser recordings.
- Planning: generate an action plan before execution.

### Backend environment variables
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_ENDPOINT`
- `DEEPSEEK_API_KEY`
- `OLLAMA_BASE_URL`
- `CHROME_PERSISTENT_SESSION`
- `RESOLUTION`
- `CORS_ORIGINS_STR`

## API surface

Main backend routes currently include:
- `/api/agent/run`
- `/api/agent/stop`
- `/api/agent/pause`
- `/api/agent/resume`
- `/api/agent/status`
- `/api/agent/history`
- `/api/browser/screenshot`
- `/api/browser/state`
- `/api/config/all`
- `/api/config/update`
- `/api/recording/list`
- `/ws/agent`

## Why this fits the Agentic Web theme

Browse-it is not just a chat UI with a browser attached. It already includes the core pieces expected in an Agentic Web product:
- goal-driven browser execution
- multi-step planning
- live observation of the agent's actions
- configurable recovery-oriented execution limits
- research and extraction workflows
- persistent session artifacts such as recordings and history
- a UI that lets the user supervise instead of micromanage
