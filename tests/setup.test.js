const { expect } = require('chai');
const sinon = require('sinon');

const setup = require('../src/setup');

describe('Index', () => {
  const wss = {
    on: sinon.fake(),
    send: sinon.fake(),
  };

  beforeEach(() => {
    sinon.resetHistory();
  });

  it('Should have `connection` listener', () => {
    setup(wss);
    sinon.assert.calledWith(wss.on.firstCall, 'connection');
  });

  describe('On Message type...', () => {
    describe('Init', () => {
      it('should setup new player with data provided by client');
      it('should send the current players to the new player');
      it('should broadcast the new player');
    });
  });
});
