var config = require('../../constants/editorConstants');
var seqConfig = require('../../seqApi/config');

function DestinationCell(params) {
  this.pitch = params.pitch;
  this.position = params.position;
  this.duration = params.duration;
  this.valid = params.valid;

  this.x = this.position * config.CELL_WIDTH;
  this.y = (seqConfig.MAX_PITCH - this.pitch) * config.CELL_HEIGHT;
}

DestinationCell.prototype.draw = function(ctx) {
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = this.valid ? "white" : "red";

  ctx.strokeRect(this.x, this.y,
      config.CELL_WIDTH * this.duration, config.CELL_HEIGHT);
};

module.exports = DestinationCell;
