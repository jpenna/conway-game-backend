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

  it('Should return player with ID');
  it('Should update players color');
  it('Should update players status');
  it('Should return all players as Array of Objects');

  it('updateLiveCells: should add cell if it is not occupied');
  it('updateLiveCells: should remove cell if it is occupied by player');
  it('updateLiveCells: should do nothing if the cell is already occupied by another player');

  it('getLiveCells: should return an array with each live cell');

  it('Should return TRUE if all players are ready');

  it('Should return TRUE if more than half the players want to stop');
});
