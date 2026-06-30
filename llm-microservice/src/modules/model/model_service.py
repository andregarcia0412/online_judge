from src.modules.model.dto.create_evaluation_message_dto import CreateEvaluationMessageDto
from src.modules.model.dto.create_chat_message_dto import CreateChatMessageDto
from src.modules.model.provider.model_provider_port import ModelProviderPort
from src.modules.model.dto.response_dto import ResponseDto

class ModelService:    
    def __init__(self, model_provider: ModelProviderPort):
        self.model_provider = model_provider

    async def send_chat_message_to_llm(self, create_chat_message_dto: CreateChatMessageDto) -> ResponseDto:
        message = f"{create_chat_message_dto.message}\nMy code in: {create_chat_message_dto.language}\n{create_chat_message_dto.code}"

        return ResponseDto(message=(await self.model_provider.send_chat_message(message)))
    
    async def send_evaluation_message_to_llm(self, create_evaluation_message_dto: CreateEvaluationMessageDto) -> ResponseDto:
        message = f"ANALYZE_COMPLEXITY {create_evaluation_message_dto.code}"

        return ResponseDto(message=(await self.model_provider.send_evaluation_message(message)))