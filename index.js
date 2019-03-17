require('dotenv').config();
const WebSocket = require('ws');
const Room = require('./src/Room');

const { setup } = require('./src/setup');

const room = new Room();

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

setup(wss, room);
