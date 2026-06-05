# Browse-it

## What is Browse-it and what can we achieve with it?
Browse-it is a web-based AI browser automation workspace with:
- A FastAPI backend that runs an automation agent and streams live progress.
- A React + Vite frontend where you configure models, browser behavior, and agent execution.

With this project, you can:
- Give natural-language web tasks and let an agent execute them step by step.
- Watch live browser screenshots and task progress in near real time.
- Run data-extraction workflows (lists/tables/structured outputs).
- Switch LLM providers based on quality, speed, privacy, and cost.
- Tune browser and agent controls for reliability and repeatability.

## How to install frontend and backend

### Backend installation (Windows)
1. Go to backend folder:
   ```powershell
   cd backend
   ```
2. Create and activate a virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
3. Install dependencies (recommended script for Python 3.14+):
   ```powershell
   install.bat
   ```
4. Install Playwright browser binaries:
   ```powershell
   playwright install chromium
   ```
5. Create backend/.env file and add keys you need (examples):
   ```env
   OPENAI_API_KEY=
   ANTHROPIC_API_KEY=
   GOOGLE_API_KEY=
   AZURE_OPENAI_API_KEY=
   AZURE_OPENAI_ENDPOINT=
   DEEPSEEK_API_KEY=
   CHROME_PERSISTENT_SESSION=false
   RESOLUTION=1920x1080x24
   ```

### Frontend installation
1. Open a second terminal and go to frontend folder:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Optional: if backend is not at localhost:8000, set API URL:
   ```powershell
   $env:VITE_API_URL="http://localhost:8000"
   ```

## How to start frontend and backend

### Start backend
From backend folder with active venv:
```powershell
python run.py
```
Backend runs on http://localhost:8000.

Alternative:
```powershell
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Start frontend
From frontend folder:
```powershell
npm run dev
```
Frontend runs on http://localhost:5173.

## Configuration settings (with recommendations)

### LLM provider recommendation
If you want the most powerful and reliable model quality for complex browsing tasks:
- OpenAI: best default quality/consistency for general use.
- Azure OpenAI (Microsoft): best for enterprise governance, compliance, private networking, and production controls.
- Google Gemini: strong speed/cost balance and very good multimodal performance.

Practical recommendation:
- Highest overall reliability: OpenAI GPT-4o class models.
- Enterprise production environments: Azure OpenAI GPT-4o deployments.
- Cost/speed-sensitive workloads: Google Gemini 2.0 Flash class models.

### LLM settings (frontend)
- Provider: selects the LLM backend (OpenAI, Anthropic, Google, Groq, DeepSeek, Ollama, Azure OpenAI, and others).
- Model: model name sent to the selected provider (for example gpt-4o, gemini-2.0-flash).
- API Key: provider credential used for requests. Keep this private.
- Base URL: custom endpoint (useful for proxy gateways, Azure-compatible endpoints, self-hosted APIs).
- Temperature (0 to 2): response randomness.
  - Lower values: more deterministic and precise.
  - Higher values: more creative but less consistent.

### Browser settings (frontend)
- Headless Mode: runs browser without visible UI window. Better for server execution.
- Disable Security: relaxes some browser security restrictions for difficult cross-origin workflows. Use only when required.
- Width: browser viewport width in pixels.
- Height: browser viewport height in pixels.
- CDP URL: connect to an existing Chromium instance via Chrome DevTools Protocol.

### Agent settings (frontend)
- Max Steps: maximum decision loops before the run stops.
- Actions/Step: max number of tool/browser actions in a single step.
- Max Input Tokens: context budget passed to the model.
- Tool Method:
  - auto: framework decides best call style.
  - function_calling: explicit tool/function call style.
  - raw: minimal transformation mode.
- Use Vision: enables screenshot/image understanding.
- Recording: saves session recordings under backend/tmp/recordings.

### Backend environment settings
- OPENAI_API_KEY: key for OpenAI provider.
- ANTHROPIC_API_KEY: key for Anthropic provider.
- GOOGLE_API_KEY: key for Google provider.
- AZURE_OPENAI_API_KEY: key for Azure OpenAI.
- AZURE_OPENAI_ENDPOINT: Azure OpenAI endpoint URL.
- DEEPSEEK_API_KEY: key for DeepSeek provider.
- OLLAMA_BASE_URL: local Ollama API URL (default http://localhost:11434).
- CHROME_PERSISTENT_SESSION: keep Chrome profile/session between runs (true/false).
- RESOLUTION: default display color-depth format (example 1920x1080x24).
- CORS_ORIGINS_STR: comma-separated frontend origins allowed by backend CORS.
