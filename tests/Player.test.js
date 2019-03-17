const { expect } = require('chai');

const Player = require('../src/Player');

describe('Player', () => {
  let player;
  const props = { color: 'blue' };

  beforeEach(() => {
    player = new Player(props);
  });

  it('Should construct player with random ID');

  it('Should construct player with provided color', () => {
    expect(player.color).to.equal(props.color);
  });

  it('Should set new color', () => {
    const color = 'green';
    player.setColor(color);
    expect(player.color).to.equal(color);
  });
});
