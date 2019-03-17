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

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  updatePlayer(id, update) {
    const player = this.getPlayer(id);
    if (update.color) player.setColor(update.color);
  }

  getPlayers() {
    const players = [];
    this.players.forEach((player) => {
      players.push(player);
    });
    return players;
  }
};
