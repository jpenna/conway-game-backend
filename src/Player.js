const uuidv4 = require('uuid/v4');

module.exports = class Player {
  constructor({ color }) {
    this.id = uuidv4();
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
