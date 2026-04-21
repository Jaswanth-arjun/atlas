import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

import backend.api as api_module
from backend.api import router
from backend.db import init_db
from backend.ws_manager import WSManager

app = FastAPI(title="ATLAS Backend")
ws_manager = WSManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.on_event("startup")
def startup():
    init_db()
    api_module.ensure_sim()


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws_manager.connect(ws)
    try:
        sim = api_module.ensure_sim()
        while True:
            frame = sim.step()
            await ws_manager.broadcast("state_update", frame)
            if frame["event"]:
                await ws_manager.broadcast("market_event", {"event": frame["event"]["name"]})
            await ws_manager.broadcast("reward_update", {"reward": frame["reward"]})
            if frame["done"]:
                await ws_manager.broadcast("episode_done", {"final_state": frame["state"]})
                break
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        ws_manager.disconnect(ws)
