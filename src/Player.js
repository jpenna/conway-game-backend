module.exports = class Player {
  constructor({ id, color }) {
    this.id = id;
    this.color = color;
  }

  setColor(color) {
    this.color = color;
  }
};
