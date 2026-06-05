@echo off
echo Installing Browser Use Backend dependencies for Python 3.14+...

echo [1/5] Pre-installing binary wheels (zstandard, cffi)...
pip install zstandard --only-binary=:all:
pip install cffi --only-binary=:all:

echo [2/5] Installing langsmith (newer version, avoids zstandard<0.24 conflict)...
pip install "langsmith>=0.4.0"

echo [3/5] Installing browser-use without deps...
pip install "browser-use==0.1.48" --no-deps

echo [4/5] Installing browser-use missing deps...
pip install psutil playwright posthog pyperclip json-repair

echo [5/5] Installing remaining requirements...
pip install fastapi "uvicorn[standard]" pydantic-settings python-dotenv websockets
pip install "langchain-core>=0.3.49" "langchain-openai>=0.3.0" "langchain-anthropic>=0.3.0"
pip install "langchain-google-genai>=2.0.0" "langchain-mistralai>=0.2.4" langchain-community
pip install "langchain_mcp_adapters>=0.0.9" "langgraph>=0.3.34"
pip install "MainContentExtractor==0.0.4"
pip install langchain langchain-ollama langchain-aws

echo Done! Start backend with: uvicorn main:app --reload
