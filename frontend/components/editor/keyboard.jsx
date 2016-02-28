var React = require('react');
var config = require('../../constants/editorConstants');
var SeqConfig = require('../../seqApi/config');
var EditorActions = require('../../actions/editorActions');
var EditorStore = require('../../stores/editorStore');

var Keyboard = React.createClass({
  componentWillMount: function() {
    this.listener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    window.requestAnimationFrame(this.draw);
  },

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

      ctx.fillStyle = (EditorStore.selectedKey() === p) ?
        config.NOTE_COLOR :
        (ctx.fillStyle = config.KEY_PATTERN[p % 12]) ? "black" : "white";

      ctx.fillRect(0, y * config.CELL_HEIGHT, width, config.CELL_HEIGHT);
      ctx.globalAlpha = 0.25;
      ctx.strokeRect(0, y * config.CELL_HEIGHT, width - 1, config.CELL_HEIGHT);
    }
  },
  onMouseMove: function(e) {
    var newPitch = 0 |
      SeqConfig.MAX_PITCH -
      this.props.numPitches *
      ((e.nativeEvent.offsetY - 6) / this.canvas.height) + 1;

    if (this.currentPitch !== newPitch) {
      this.currentPitch = Math.min(SeqConfig.MAX_PITCH,
          Math.max(SeqConfig.MIN_PITCH, newPitch));
      EditorActions.selectKey(this.currentPitch);
    }
  },

  onMouseLeave: function(e) {
      this.currentPitch = null;
      EditorActions.selectKey(null);
  },


  render: function() {
    return (
      <div className="keyboard">
        <canvas id="keyboard-canvas"
          width="32"
          height={this.props.height}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}

        />

      </div>
    );
  }

});

module.exports = Keyboard;
