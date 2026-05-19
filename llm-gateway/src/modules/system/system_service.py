import time
from src.modules.system.dto.health_response_dto import HealthResponseDto

start_time = time.time()

class SystemService:
    def health(self) -> HealthResponseDto:
        return HealthResponseDto(status="ok", model="online_judge_model", uptime_seconds=(time.time() - start_time))