const { expect } = require('chai');
const sinon = require('sinon');

const { setup, onMessage } = require('../src/setup');

describe('Index', () => {
  let player1;
  let player2;
  const room = {
    addPlayer: sinon.fake(),
    updatePlayer: sinon.fake(),
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
    player1 = { color: 'gray' };
    player2 = { color: 'blue' };
    room.getPlayers = sinon.fake.returns([player1, player2]);
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
        const message = JSON.stringify({ type: 'init', payload: player1 });
        onMessage(wss, ws, room, message);
        sinon.assert.calledOnce(room.addPlayer);
        const { id, ...player } = room.addPlayer.getCall(0).args[0];
        expect(player).to.deep.equal({ ...player1, status: 'pending' });
      });

      it('should broadcast all players', () => {
        const message = JSON.stringify({ type: 'init', payload: player1 });
        onMessage(wss, ws, room, message);
        sinon.assert.calledOnce(wss.broadcast);
        expect(wss.broadcast.getCall(0).args[0])
          .to.deep.equal({ type: 'players', payload: [player1, player2] });
      });
    });

    describe('player:update', () => {
      it('Should update player with ID', () => {
        const payload = { id: 'p2', update: { color: 'purple' } };
        const message = JSON.stringify({ type: 'player:update', payload });
        onMessage(wss, ws, room, message);
        sinon.assert.calledOnce(room.updatePlayer);
        expect(room.updatePlayer.getCall(0).args)
          .to.deep.equal([payload.id, payload.update]);
      });

      it('Should broadcast all players', () => {
        const payload = { id: 'p2', update: { color: 'purple' } };
        const message = JSON.stringify({ type: 'player:update', payload });
        onMessage(wss, ws, room, message);
        sinon.assert.calledOnce(wss.broadcast);
        expect(wss.broadcast.getCall(0).args[0])
          .to.deep.equal({ type: 'players', payload: [player1, player2] });
      });
    });
  });
});
