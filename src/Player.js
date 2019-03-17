module.exports = class Player {
  constructor({ id, color }) {
    this.id = id;
    this.color = color;
  }

  toString() {
    return {
      id: this.id,
      color: this.color,
    };
  }

  setColor(color) {
    this.color = color;
  }
};
