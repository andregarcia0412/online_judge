from pydantic import BaseModel

class ResponseDto(BaseModel):
    message: str