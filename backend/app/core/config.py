from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE, override=False)

class Settings(BaseSettings):
    gemini_api_key: str = ""
    groq_api_key: str = ""
    cerebras_api_key: str = ""
    hf_api_token: str = ""
    firebase_project_id: str = ""
    firebase_service_account_path: str = "./firebase-service-account.json"
    environment: str = "development"
    allowed_origins: str = "http://localhost:5173"
    hf_disease_model: str = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
    hf_confidence_threshold: float = 0.55
    groq_vlm_model: str = "qwen/qwen3.6-27b"
    weather_api_key: str = ""
    weather_api_url: str = "https://api.openweathermap.org/data/2.5"

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

settings = Settings()
print("✅ Settings loaded")
print(f"   Groq configured: {bool(settings.groq_api_key)}")
