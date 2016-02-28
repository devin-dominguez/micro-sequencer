var React = require('react');
var config = require('../../constants/editorConstants');
var SeqConfig = require('../../seqApi/config');

var Keyboard = React.createClass({

  componentDidMount: function() {
    this.canvas = document.getElementById("keyboard-canvas");
    this.canvas.style.cursor = "pointer";
    this.ctx = this.canvas.getContext("2d");
    this.ctx.translate(0.5, 0.5);
    window.requestAnimationFrame(this.draw);
  },

  draw: function() {
    var ctx = this.ctx;
    var width = this.canvas.width;
    var height = this.canvas.height;
    ctx.clearRect(-1, -1, width + 1, height + 1);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = config.GRID_COLOR;

    for (var p = SeqConfig.MAX_PITCH; p >= SeqConfig.MIN_PITCH; p--) {
      var y = SeqConfig.MAX_PITCH - p;
      ctx.globalAlpha = 0.125;
      ctx.fillStyle = config.KEY_PATTERN[p % 12] ? "black" : "white";
      ctx.fillRect(0, y * config.CELL_HEIGHT, width, config.CELL_HEIGHT);
      ctx.globalAlpha = 0.25;
      ctx.strokeRect(0, y * config.CELL_HEIGHT, width - 1, config.CELL_HEIGHT);
    }
  },
  onMouseMove: function(e) {
    var newPitch = 0 |
      SeqConfig.MAX_PITCH -
      this.props.numPitches *
      (e.nativeEvent.offsetY / this.canvas.height) + 1;
  },


  render: function() {
    return (
      <div className="keyboard">
        <canvas id="keyboard-canvas"
          width="32"
          height={this.props.height}
          onMouseOver={this.onMouseMove}

        />

      </div>
    );
  }

});

module.exports = Keyboard;
