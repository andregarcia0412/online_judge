from pydantic import BaseModel

class CreateChatMessageDto(BaseModel):
    language: str
    code: str
    message: str