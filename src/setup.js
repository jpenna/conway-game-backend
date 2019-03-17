const Player = require('./Player');

function onMessage(wss, ws, room, message) {
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
    default: break;
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
