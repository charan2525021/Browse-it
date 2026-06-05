from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins_str: str = "http://localhost:5173,http://localhost:3000"

    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""
    azure_openai_api_key: str = ""
    azure_openai_endpoint: str = ""
    deepseek_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"

    chrome_persistent_session: bool = False
    resolution: str = "1920x1080x24"

    model_config = {
        "env_file": ".env",
        "extra": "allow",
    }

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins_str.split(",") if origin.strip()]

settings = Settings()
