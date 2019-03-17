const { expect } = require('chai');
const sinon = require('sinon');

const { setup, onMessage } = require('../src/setup');

describe('Index', () => {
  let player;
  const room = {
    addPlayer: sinon.fake(),
    // getPlayers: sinon.fake(), stubbed below
  };
  const wss = {
    on: sinon.fake(),
    send: sinon.fake(),
    broadcast: sinon.fake(),
  };
  const ws = {
    send: sinon.fake(),
  };

  beforeEach(() => {
    player = { id: 'playerId', color: 'gray' };
    room.getPlayers = sinon.fake.returns([player]);
    sinon.resetHistory();
  });

  it('Should have `connection` listener', () => {
    setup(wss);
    sinon.assert.calledWith(wss.on.firstCall, 'connection');
  });

  it('Should JSON.stringify all sent payload', () => {
    setup(wss);
    sinon.assert.calledWith(wss.on.firstCall, 'connection');
  });

  describe('On Message type...', () => {
    describe('init', () => {
      it('should setup new player with data provided by client', () => {
        const message = JSON.stringify({ type: 'init', payload: player });
        onMessage(wss, ws, room, message);
        sinon.assert.calledOnce(room.addPlayer);
        expect(room.addPlayer.getCall(0).args[0]).to.deep.equal(player);
      });

      it('should broadcast the new player', () => {
        const message = JSON.stringify({ type: 'init', payload: player });
        onMessage(wss, ws, room, message);
        sinon.assert.calledOnce(wss.broadcast);
        expect(wss.broadcast.getCall(0).args[0]).to.deep.equal({ type: 'players', payload: [player] });
      });
    });
  });
});
