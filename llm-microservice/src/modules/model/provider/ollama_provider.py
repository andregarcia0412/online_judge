from ollama import AsyncClient
from fastapi import HTTPException
import os
from src.modules.model.provider.model_provider_port import ModelProviderPort

class OllamaProvider(ModelProviderPort):
    
    def __init__(self):
        host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.client = AsyncClient(host=host)
    
    async def send_chat_message(self, message: str) -> str:
        try:
            return (await self.client.chat(
                model="online_judge_chat_model",
                messages=[
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            ))["message"]["content"]
        except (ConnectionError):
            raise HTTPException(
                status_code=503,
                detail="Chat model offline"
            )
    
    async def analyze_complexity(self, message: str) -> str:
        try:
            return(await self.client.chat(
                model="online_judge_analysis_model",
                messages=[
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            ))["message"]["content"]
        except(ConnectionError):
            raise HTTPException(
                status_code=503,
                detail="Analysis model offline"
            )
        