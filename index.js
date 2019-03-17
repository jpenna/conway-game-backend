require('dotenv').config();
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: process.env.PORT | 17000,
});

wss.broadcast = (data) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  ws.send('something');
});

const path = require('path');
