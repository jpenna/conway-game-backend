const uuidv4 = require('uuid/v4');

module.exports = class Player {
  constructor({ color, status }) {
    this.id = uuidv4();
    this.color = color;
    this.status = status || 'pending';
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
