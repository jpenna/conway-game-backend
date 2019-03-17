require('dotenv').config();
const WebSocket = require('ws');

const ws = new WebSocket(`ws://localhost:${process.env.WS_PORT || 17000}`);

const sendOriginal = ws.send;
ws.send = function send(data) {
  sendOriginal.call(this, JSON.stringify(data));
};

ws.on('open', () => {
  ws.send({ type: 'init', payload: { id: 'myId', color: 'blue' } });
});

ws.on('message', (data) => {
  console.log(data);
});
