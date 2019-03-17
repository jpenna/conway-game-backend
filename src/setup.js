const Room = require('./Room');
const Player = require('./Player');

const room = new Room();

module.exports = (wss) => {
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const { type, payload } = JSON.parse(message);

      switch (type) {
        case 'init': {
          const { id, color } = payload;
          const player = new Player({ id, color });
          room.addPlayer(player);
          wss.broadcast({ type: 'newPlayer', payload: { id, color } });
          break;
        }
        default: break;
      }

      console.log('received: %s', message);
    });
  });
};
