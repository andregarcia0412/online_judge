from fastapi import Security, HTTPException, Depends
from fastapi.security import APIKeyHeader
from hmac import compare_digest
from src.shared.config.config import get_settings, Settings

api_key_header = APIKeyHeader(name="X-API-PASSWORD", auto_error=False)

def verify_api_key(key: str = Security(api_key_header), settings: Settings = Depends(get_settings)) -> None:
    if not key or not compare_digest(key, settings.internal_api_key):
        raise HTTPException(status_code=401, detail="Invalid API key")