from fastapi import FastAPI
from src.modules.model.model_controller import model_router
from src.modules.system.system_controller import system_router

app = FastAPI(
    title="Online Judge LLM Gateway",
    version="1.0.0"
)

app.include_router(model_router)
app.include_router(system_router)