from ollama import AsyncClient
from src.modules.model.provider.model_provider_port import ModelProviderPort

class OllamaProvider(ModelProviderPort):
    
    def __init__(self):
        self.client = AsyncClient()
    
    async def send_chat_message(self, message: str) -> str:
        return (await self.client.chat(
            model="online_judge_model",
            messages=[
                {
                    "role": "user",
                    "content": message
                }
            ]
        ))["message"]["content"]

        