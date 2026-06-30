from fastapi import FastAPI, Depends
from src.modules.model.model_controller import model_router
from src.modules.system.system_controller import system_router
from src.shared.security.verify_key import verify_api_key

app = FastAPI(
    title="Online Judge LLM Gateway",
    version="1.0.0",
    dependencies=[Depends(verify_api_key)]
)

app.include_router(model_router)
app.include_router(system_router)