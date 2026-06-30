from abc import ABC, abstractmethod


class ModelProviderPort(ABC):

    @abstractmethod
    async def send_chat_message(self, message: str) -> str:
        pass