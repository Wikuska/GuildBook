from fastapi import WebSocket
from collections import defaultdict

class ConnectionManager:
    def __init__(self):
        self._rooms: dict[int, set[WebSocket]] = defaultdict(set)

    async def connect(self, conversation_id: int, websocket: WebSocket):
        self._rooms[conversation_id].add(websocket)

    def disconnect(self, conversation_id: int, websocket: WebSocket):
        self._rooms[conversation_id].discard(websocket)
        if not self._rooms[conversation_id]:
            del self._rooms[conversation_id]

    async def broadcast(self, conversation_id: int, payload: dict):
        for ws in list(self._rooms[conversation_id]):
            try:
                await ws.send_json(payload)
            except Exception:
                self._rooms[conversation_id].discard(ws)

manager = ConnectionManager()