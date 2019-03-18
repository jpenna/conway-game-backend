require('dotenv').config();
const WebSocket = require('ws');
const http = require('http');

const Room = require('./src/Room');
const { setup } = require('./src/setup');

const port = process.env.PORT || 17000;
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS);
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  res.end('Hello, this is just for Websocket :)');
});
server.listen(port);

console.info(`HTTP and WS server listening on ${port}`);

const room = new Room();

const wss = new WebSocket.Server({ server });

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

setup(wss, room);
