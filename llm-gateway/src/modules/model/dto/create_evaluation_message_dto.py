from pydantic import BaseModel

class CreateEvaluationMessageDto(BaseModel):
    code: str