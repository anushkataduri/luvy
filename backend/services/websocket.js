const { WebSocketServer } = require('ws');

let wss = null;

function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (err) => {
      console.error('WebSocket client error:', err);
    });
  });

  console.log('WebSocket Server Initialized');
}

function broadcast(message) {
  if (!wss) {
    console.warn('WebSocket Server not initialized yet');
    return;
  }

  const payload = typeof message === 'string' ? message : JSON.stringify(message);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      try {
        client.send(payload);
      } catch (err) {
        console.error('Error sending message to client:', err);
      }
    }
  });
}

module.exports = {
  initWebSocket,
  broadcast,
};
