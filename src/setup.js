const Player = require('./Player');

function onMessage(wss, ws, room, message) {
  console.log(message)
  try {
    const { type, payload } = JSON.parse(message);

    switch (type) {
      case 'init': {
        const { id, color } = payload;
        const player = new Player({ id, color });
        room.addPlayer(player);
        const players = room.getPlayers();
        wss.broadcast({ type: 'players', payload: players });
        break;
      }
      case 'update:player': {
        const { id, update } = payload;
        room.updatePlayer(id, update);
        const players = room.getPlayers();
        wss.broadcast({ type: 'players', payload: players });
        break;
      }
      default: break;
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  onMessage,
  setup: (wss, room) => {
    wss.on('connection', (ws) => {
      // Always send JSON
      const sendOriginal = ws.send;
      ws.send = function send(data) { // eslint-disable-line no-param-reassign
        sendOriginal.call(this, JSON.stringify(data));
      };
      ws.on('message', message => onMessage(wss, ws, room, message));
    });
  },
};
