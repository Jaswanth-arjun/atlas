const WS = "ws://localhost:8000/ws";

export function connectWS(onEvent) {
  const ws = new WebSocket(WS);
  ws.onmessage = (msg) => onEvent(JSON.parse(msg.data));
  return ws;
}
