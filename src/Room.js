module.exports = class Room {
  constructor() {
    this.players = new Map();
  }

  addPlayer(player) {
    this.players.set(player.id, player);
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }
};
