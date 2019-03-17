require('dotenv').config();
const WebSocket = require('ws');

const ws = new WebSocket(`ws://localhost:${process.env.WS_PORT || 17000}`);

ws.on('open', () => {
  ws.send('something');
});

ws.on('message', (data) => {
  console.log(data);
});
