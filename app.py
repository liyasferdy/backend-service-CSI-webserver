from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Amplitude(BaseModel):
    amplitude: float

latest_amplitude = None
clients: List[WebSocket] = []

@app.get("/")
async def get():
    return FileResponse('static/index.html')

@app.post("/")
async def post_data(amplitude: Amplitude):
    global latest_amplitude
    latest_amplitude = amplitude.amplitude
    print(f"Received amplitude: {latest_amplitude}")
    # Send the latest amplitude to all connected clients
    for client in clients:
        await client.send_json({"amplitude": latest_amplitude})
    return {"message": "success"}

@app.get("/latest")
async def get_latest():
    return {"amplitude": latest_amplitude}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Message from client: {data}")
    except WebSocketDisconnect:
        clients.remove(websocket)
        print("Client disconnected")
