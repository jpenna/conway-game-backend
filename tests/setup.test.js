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
});
