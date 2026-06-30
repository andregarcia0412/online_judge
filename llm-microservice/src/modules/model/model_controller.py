from fastapi import APIRouter
from src.modules.model.model_service import ModelService
from src.modules.model.dto.create_chat_message_dto import CreateChatMessageDto
from src.modules.model.dto.create_evaluation_message_dto import CreateEvaluationMessageDto
from src.modules.model.provider.ollama_provider import OllamaProvider

ollama_provider = OllamaProvider()
model_router = APIRouter(prefix="/model", tags=["model"])
model_service = ModelService(ollama_provider)

@model_router.post("/chat")
async def generate_chat_message(create_chat_message_dto: CreateChatMessageDto):
    return await model_service.send_chat_message_to_llm(create_chat_message_dto)

@model_router.post("/evaluation")
async def generate_evaluation_message(create_evaluation_message_dto: CreateEvaluationMessageDto):
    return await model_service.send_evaluation_message_to_llm(create_evaluation_message_dto)
