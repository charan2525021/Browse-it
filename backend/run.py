import asyncio
import sys
import os

if __name__ == '__main__':
    # Load .env before starting server so API keys are available
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

    import uvicorn

    config = uvicorn.Config("main:app", host="0.0.0.0", port=8000, reload=False, log_level="info")
    server = uvicorn.Server(config)

    if sys.platform == 'win32':
        # On Windows, Playwright requires ProactorEventLoop to spawn browser subprocesses.
        # We must explicitly create it and set it as the current loop before uvicorn starts.
        loop = asyncio.ProactorEventLoop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(server.serve())
        finally:
            loop.close()
    else:
        asyncio.run(server.serve())