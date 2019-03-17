const Player = require('./Player');

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const actionMap = new Map([
  ['init', ({ wss, ws, room, payload }) => {
    const { id, color } = payload;
    const player = new Player({ id, color });
    room.addPlayer(player);
    ws.send({ type: 'players:self', payload: player });
    ws.playerId = player.id; // eslint-disable-line no-param-reassign
    const players = room.getPlayers();
    wss.broadcast({ type: 'players', payload: players });
  }],
  ['player:update', ({ wss, room, payload }) => {
    const { id, update } = payload;
    room.updatePlayer(id, update);
    const players = room.getPlayers();
    wss.broadcast({ type: 'players', payload: players });
  }],
  ['player:remove', ({ wss, room, payload }) => {
    const { id } = payload;
    room.removePlayer(id);
    const players = room.getPlayers();
    wss.broadcast({ type: 'players', payload: players });
  }],
]);

function onMessage(wss, ws, room, message) {
  console.log(message);

  try {
    const { type, payload } = JSON.parse(message);
    const action = actionMap.get(type);
    if (action) action({ wss, ws, room, payload });
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  onMessage,
  setup: (wss, room) => {
    // Check broken connections
    setInterval(() => {
      wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false; // eslint-disable-line no-param-reassign
        ws.ping(noop);
      });
    }, 30000);

    wss.on('connection', (ws) => {
      ws.isAlive = true; // eslint-disable-line no-param-reassign
      // Always send JSON
      const sendOriginal = ws.send;
      ws.send = function send(data) { // eslint-disable-line no-param-reassign
        sendOriginal.call(this, JSON.stringify(data));
      };
      // On message from client
      ws.on('message', message => onMessage(wss, ws, room, message));
      // Detect broken connection
      ws.on('pong', heartbeat);
      // Remove user if disconnected
      ws.on('close', () => {
        const removeAction = actionMap.get('player:remove');
        removeAction({ wss, room, payload: { id: ws.playerId } });
      });
    });
  },
};
