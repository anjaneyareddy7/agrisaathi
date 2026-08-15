from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import crop, fertilizer, diagnosis, health, weather, helper, ledger, animal_encyclopedia, livestock, crop_planner, crop_passport, livestock_encyclopedia

app = FastAPI(
    title="AgriSaathi API",
    description="AI-powered Agriculture Assistant",
    version="1.0.0"
)

origins = [origin.strip() for origin in settings.allowed_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(crop.router)
app.include_router(fertilizer.router)
app.include_router(diagnosis.router)
app.include_router(livestock_encyclopedia.router)
app.include_router(weather.router)
app.include_router(helper.router)
app.include_router(ledger.router)
app.include_router(animal_encyclopedia.router)
app.include_router(livestock.router)
app.include_router(crop_planner.router)
app.include_router(crop_passport.router)
app.include_router(livestock.router)

@app.get("/")
def root():
    return {"service": "AgriSaathi API", "version": "1.0.0", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
