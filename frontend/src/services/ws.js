const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const WS = import.meta.env.VITE_WS_BASE_URL || `${protocol}//${window.location.host}/ws`;

export function connectWS(onEvent) {
  let ws = null;
  let reconnectTimer = null;
  let closedByUser = false;

  const connect = () => {
    ws = new WebSocket(WS);
    ws.onmessage = (msg) => onEvent(JSON.parse(msg.data));
    ws.onclose = () => {
      if (closedByUser) return;
      reconnectTimer = window.setTimeout(connect, 1200);
    };
    ws.onerror = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  };

  connect();

  return {
    close() {
      closedByUser = true;
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      if (ws) {
        ws.close();
      }
    },
  };
}
