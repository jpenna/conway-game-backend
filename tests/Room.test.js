const { expect } = require('chai');

const Room = require('../src/Room');

describe('Room', () => {
  let room;
  const player = { id: 'hello' };

  beforeEach(() => {
    room = new Room();
  });

  it('Should add new player to room', () => {
    room.addPlayer(player);
    expect(room.players.has(player.id)).to.be.true;
  });

  it('Should remove player from room', () => {
    room.addPlayer(player);
    room.removePlayer(player.id);
    expect(room.players.has(player.id)).to.be.false;
  });
});
