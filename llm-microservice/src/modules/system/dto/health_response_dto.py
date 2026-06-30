from pydantic import BaseModel

class HealthResponseDto(BaseModel):
    status: str
    model: str
    uptime_seconds: float

