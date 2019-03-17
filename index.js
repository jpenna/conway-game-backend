require('dotenv').config();
const WebSocket = require('ws');

const setup = require('./src/setup');

const wss = new WebSocket.Server({
  port: process.env.PORT || 17000,
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

setup(wss);
