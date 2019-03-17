const { expect } = require('chai');

const Player = require('../src/Player');

describe('Player', () => {
  let player;
  const props = { color: 'blue' };

  beforeEach(() => {
    player = new Player(props);
  });

  it('Should construct player with random ID');

  it('Should construct player with provided status');
  it('Should construct player with default status if none provided');
  it('Should construct player with provided color', () => {
    expect(player.color).to.equal(props.color);
  });

  it('Should set new color', () => {
    const color = 'green';
    player.setColor(color);
    expect(player.color).to.equal(color);
  });

  it('Set new player status as `ready`');
  it('Set new player status as `stop`');
  it('Set new player status as `peding`');
  it('Skip setting status if it is not acceptable');
});
