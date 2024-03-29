const { expect } = require('chai');
const sinon = require('sinon');

const { setup, onMessage } = require('../src/setup');

describe('Index', () => {
  let player1;
  let player2;
  const room = {
    addPlayer: sinon.fake(),
    updatePlayer: sinon.fake(),
    // getPlayersList: sinon.fake(), stubbed below
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
    room.getPlayersList = sinon.fake.returns([player1, player2]);
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

  it('Should disconnect players that don\'t respond for too long');
  it('Should remove player from room if connection is closed');

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

      it('should set player ID in ws instance');
      it('should send current live map');
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

    describe('player:remove', () => {
      it('Should remove player with provide ID');
      it('Should broadcast remaining players list');
      it('Should broadcast updated live cells without player\'s cells');
    });

    describe('world:update', () => {
      it('Should update world with new cells');
      it('Should broadcast new world configuration');
    });

    describe('game:start', () => {
      it('Should update player status to ready');
      it('Should broadcast players list');
      it('Should start game if everybody is ready');
      it('Should not start game if everybody is not ready');
    });

    describe('game:stop', () => {
      it('Should update player status to stop');
      it('Should broadcast players list');
      it('Should stop game if the majority wants stop');
      it('Should not stop game if only the minority wants');
    });

    describe('game:clear', () => {
      it('Should clear game');
      it('Should broadcast game:reload');
    });
  });
});
