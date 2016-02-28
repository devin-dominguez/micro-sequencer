var config = require('../../constants/editorConstants');
var seqConfig = require('../../seqApi/config');

function Cell(params) {
  this.note = params.note;

  this.pitch = params.pitch;
  this.position = params.position;

  this.selected = params.selected;
  this.destination = params.destination;

  this.x = this.position * config.CELL_WIDTH;
  this.y = (seqConfig.MAX_PITCH - this.pitch) * config.CELL_HEIGHT;
}

Cell.prototype.draw = function(ctx) {
  ctx.globalAlpha = 0.75;
  if (this.note) {
    if (this.selected) {
      ctx.globalAlpha = 0.25;
    }

    this.drawNoteBody(ctx);
    this.drawNoteTail(ctx);
  }

};

Cell.prototype.drawSelected = function(ctx) {
    ctx.strokeStyle = config.GRID_COLOR;

    ctx.fillRect(this.x, this.y, config.CELL_WIDTH, config.CELL_HEIGHT);
    ctx.strokeRect(this.x, this.y, config.CELL_WIDTH, config.CELL_HEIGHT);
};

Cell.prototype.drawNoteBody = function(ctx) {

  if (this.note.position === this.position) {
    ctx.fillStyle = config.NOTE_COLOR;

    ctx.fillRect(this.x + 1, this.y + 1,
        config.CELL_WIDTH * this.note.duration - 2, config.CELL_HEIGHT - 2);
  }
};

Cell.prototype.drawNoteTail = function(ctx) {
  if (this.note.position + this.note.duration - 1 === this.position) {
    ctx.fillStyle = config.NOTE_TAIL_COLOR;

    ctx.fillRect(
        this.x + config.CELL_WIDTH - config.NOTE_TAIL_WIDTH - 1,
        this.y + 1,
        config.NOTE_TAIL_WIDTH,
        config.CELL_HEIGHT - 2);
  }
};

module.exports = Cell;
