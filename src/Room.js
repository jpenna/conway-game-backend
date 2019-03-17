module.exports = class Room {
  constructor() {
    this.players = new Map();
    this.liveCells = new Map();
    this.running = false;
  }

  // Players
  addPlayer(player) {
    this.players.set(player.id, player);
  }

  removePlayer(playerId) {
    this.players.delete(playerId);

    // TODO remove players cells if game not running
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  updatePlayer(id, update) {
    const player = this.getPlayer(id);
    if (update.color) player.setColor(update.color);
    if (update.status) player.setStatus(update.status);
  }

  getPlayersList() {
    const players = [];
    this.players.forEach((player) => {
      players.push(player);
    });
    return players;
  }

  // World
  // TODO validate key
  updateLiveCells({ id, color, key }) {
    const cell = this.liveCells.get(key);
    // Unoccupied cell
    if (!cell) {
      // TODO if occupied, return message telling it is occupied
      return !!this.liveCells.set(key, { id, color });
    }
    // It is not the client's cell
    if (cell.id !== id) return false;
    // Remove occupied cell
    return this.liveCells.delete(key);
  }

  getLiveCells() {
    const liveCells = [];
    this.liveCells.forEach((cell, key) => {
      liveCells.push([key, cell]);
    });
    return liveCells;
  }

  // Game
  shouldStart() {
    // TODO use variable for state instead of hard coded
    return this.getPlayersList().every(p => p.status === 'ready');
  }

  shouldStop() {
    // TODO use variable for state instead of hard coded
    let count = 0;
    const players = this.getPlayersList();
    const threshold = players.length / 2;
    return players.some((p) => {
      if (p.status === 'stop') count += 1;
      if (count >= threshold) return true;
      return false;
    });
  }
};
