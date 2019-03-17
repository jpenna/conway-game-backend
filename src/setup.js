const Player = require('./Player');

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const actionMap = new Map([
  // Init
  ['init', ({ wss, ws, room, payload }) => {
    const { id, color } = payload;
    const player = new Player({ id, color });
    room.addPlayer(player);
    ws.send({ type: 'players:self', payload: player });
    ws.playerId = player.id; // eslint-disable-line no-param-reassign
    const players = room.getPlayersList();
    wss.broadcast({ type: 'players', payload: players });
    const liveCells = room.getLiveCells();
    wss.broadcast({ type: 'world', payload: liveCells });
  }],

  // Players
  ['player:update', ({ wss, room, payload }) => {
    const { id, update } = payload;
    room.updatePlayer(id, update);
    const players = room.getPlayersList();
    wss.broadcast({ type: 'players', payload: players });
  }],
  ['player:remove', ({ wss, room, payload }) => {
    const { id } = payload;
    room.removePlayer(id);
    const players = room.getPlayersList();
    wss.broadcast({ type: 'players', payload: players });
  }],

  // World
  ['world:update', ({ wss, ws, room, payload }) => {
    const id = ws.playerId;
    const { color } = room.getPlayer(id);
    payload.forEach(({ key }) => {
      room.updateLiveCells({ id, color, key });
    });
    const liveCells = room.getLiveCells();
    wss.broadcast({ type: 'world', payload: liveCells });
  }],

  // Game
  ['game:start', ({ wss, ws, room }) => {
    room.updatePlayer(ws.playerId, { status: 'ready' });
    const players = room.getPlayersList();
    wss.broadcast({ type: 'players', payload: players });
    if (!room.shouldStart()) return;
    wss.broadcast({ type: 'game:start' });
  }],
  ['game:stop', ({ wss, ws, room }) => {
    room.updatePlayer(ws.playerId, { status: 'stop' });
    const players = room.getPlayersList();
    wss.broadcast({ type: 'players', payload: players });
    if (!room.shouldStop()) return;
    wss.broadcast({ type: 'game:stop' });
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
    }, 10000);

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
