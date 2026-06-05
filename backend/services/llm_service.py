import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

PROVIDERS = [
    "openai", "anthropic", "google", "azure_openai", "deepseek",
    "ollama", "mistral", "alibaba", "moonshot", "unbound",
    "ibm", "grok", "groq", "siliconflow", "modelscope",
]

def get_providers():
    return PROVIDERS

def test_llm(provider: str, model_name: str, api_key: str = "") -> dict:
    try:
        from src.utils.llm_provider import get_llm_model
        llm = get_llm_model(provider=provider, model_name=model_name, api_key=api_key or None)
        return {"success": True, "message": "LLM connection successful"}
    except Exception as e:
        return {"success": False, "message": str(e)}
