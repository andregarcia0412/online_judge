from fastapi import APIRouter
from src.modules.system.system_service import SystemService
from src.modules.system.dto.health_response_dto import HealthResponseDto

system_router = APIRouter(tags=["system"])
system_service = SystemService()

@system_router.get('/health')
def health() -> HealthResponseDto:
    return system_service.health()
