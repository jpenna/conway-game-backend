const { expect } = require('chai');

const Player = require('../src/Player');

describe('Player', () => {
  let player;
  const props = { id: 'myId', color: 'blue' };

  beforeEach(() => {
    player = new Player(props);
  });

  it('Should construct player with provided id and color', () => {
    expect(player.id).to.equal(props.id);
    expect(player.color).to.equal(props.color);
  });

  it('Should set new color', () => {
    const color = 'green';
    player.setColor(color);
    expect(player.color).to.equal(color);
  });
});
