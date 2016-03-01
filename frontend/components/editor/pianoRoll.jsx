var React = require('react');
var EditorStore = require('../../stores/editorStore');
var EditorActions = require('../../actions/editorActions');
var PlaybackStore = require('../../stores/playbackStore');
var SeqConfig = require('../../seqApi/config');
var config = require('../../constants/editorConstants');
var Cell = require('./cell');
var DestinationCell = require('./destinationCell');
var Keyboard = require('./keyboard');

var PianoRoll = React.createClass({
  getInitialState: function() {
    return {
      length: EditorStore.phraseLength(),
      currentTick: 0,
      isStopped: true
    };
  },

  componentWillMount: function() {
    this.editorListener = EditorStore.addListener(this.onChange);
    this.playBackListener = PlaybackStore.addListener(this.onChange);

    this.numPitches = SeqConfig.MAX_PITCH - SeqConfig.MIN_PITCH + 1;
    this.cellMap = {};
    this.currentCell = {};
  },

  componentDidMount: function() {
    this.canvas = document.getElementById("matrix-canvas");
    this.canvas.style.cursor = "crosshair";
    this.ctx = this.canvas.getContext("2d");
    this.ctx.translate(0.5, 0.5);
    window.requestAnimationFrame(this.draw);
    this.matrix = document.querySelector(".matrix");
    this.keyboard = document.querySelector(".keyboard");
  },

  componentWillUnmount: function() {
    this.editorListener.remove();
    this.playbackListener.remove();
  },

  onChange: function() {
    this.setState({
      length: EditorStore.phraseLength(),
      isStopped: PlaybackStore.isStopped(),
      currentTick: PlaybackStore.currentTick()
    });
    window.requestAnimationFrame(this.draw);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return this.state.length !== nextState.length;
  },

  draw: function() {
    this.drawGrid();
    this.createCells();
    this.drawCells();

    this.updateCurrentCellInfo();
  },

  drawGrid: function() {
    var ctx = this.ctx;
    var width = this.canvas.width;
    var height = this.canvas.height;
    ctx.clearRect(-1, -1, width + 1, height + 1);

    ctx.strokeStyle = config.GRID_COLOR;
    for (var p = SeqConfig.MAX_PITCH; p >= SeqConfig.MIN_PITCH; p--) {
      var y = SeqConfig.MAX_PITCH - p;
      ctx.globalAlpha = 0.0625;
      ctx.fillStyle = config.KEY_PATTERN[p % 12] ? "black" : "white";
      ctx.fillRect(0, y * config.CELL_HEIGHT, width, config.CELL_HEIGHT);
      ctx.globalAlpha = (EditorStore.selectedKey() === p) ? 1 : 0.125;
      ctx.strokeRect(0, y * config.CELL_HEIGHT, width, config.CELL_HEIGHT);
    }

    for (var x = 0; x < this.state.length + 1; x++) {
      ctx.globalAlpha = x % 4  === 0 ? 1 : 0.25;
      ctx.strokeStyle = x % 16 === 0 ? config.GRID_BAR_COLOR : config.GRID_COLOR;
      ctx.beginPath();
      ctx.moveTo(x * config.CELL_WIDTH, 0);
      ctx.lineTo(x * config.CELL_WIDTH, height);
      ctx.stroke();
      ctx.closePath();
    }

    if (!this.state.isStopped) {
      ctx.globalAlpha = 0.125;
      ctx.fillRect(this.state.currentTick * config.CELL_WIDTH, 0,
          config.CELL_WIDTH, height);
    }

    ctx.globalAlpha = 1;
    ctx.strokeStyle = config.GRID_BAR_COLOR;
    ctx.strokeRect(0, 0, width, height - 1);

  },

  createCells: function() {
    this.cellMap = {};
    this.noteCells = EditorStore.noteCells().map(function(cell) {
      this.cellMap[cell.key] = cell;
      return new Cell(cell);
    }, this);

    this.destinationCells = EditorStore.destinationCells().map(function(cell) {
      return new DestinationCell(cell);
    },this);
  },

  drawCells: function() {
    this.noteCells.forEach(function(cell) {
      cell.draw(this.ctx);
    }, this);

    this.destinationCells.forEach(function(cell) {
      cell.draw(this.ctx);
    }, this);
  },

  onMouseMove: function(e) {
    var newPosition = 0 |
      this.state.length *
      (e.nativeEvent.offsetX / this.canvas.width);

    var newPitch = 0 |
      SeqConfig.MAX_PITCH -
      this.numPitches *
      (e.nativeEvent.offsetY / this.canvas.height) + 1;

      if (this.currentCell.note) {
        var note = this.currentCell.note;
        var noteEnd = (note.position + note.duration) * config.CELL_WIDTH;
        var offset = e.nativeEvent.offsetX;
        var subPosition = noteEnd - offset;
        this.onTail = subPosition < config.NOTE_TAIL_WIDTH;
      } else {
        this.onTail = false;
      }

      this.updateCursor();
      this.updateCurrentCellInfo();


    if (this.currentPitch !== newPitch ||
        this.currentPosition !== newPosition) {
      this.currentPitch = Math.min(SeqConfig.MAX_PITCH,
          Math.max(SeqConfig.MIN_PITCH, newPitch));
      this.currentPosition = Math.min(this.state.length,
          Math.max(0, newPosition));

      this.onEnterNewCell();
    }
  },

  updateCursor: function() {
    if (!this.moveDrag && !this.copyDrag && !this.resizeDrag) {
      this.canvas.style.cursor = this.currentCell.note ? "pointer" : "crosshair";
    }
    if (this.onTail) {
      this.canvas.style.cursor = "col-resize";
    }
  },

  updateCurrentCellInfo: function() {
    var key = this.currentPitch * this.state.length + this.currentPosition;
    this.currentCell = this.cellMap[key] || {};
  },

  onDoubleClick: function(e) {
    e.preventDefault();
    if (this.currentCell.note) {
      EditorActions.removeNote(this.currentCell.note);
    } else {
      EditorActions.insertNote({
        pitch: this.currentPitch,
        position: this.currentPosition,
        duration: 1
      });
    }
  },

  onMouseDown: function(e) {
    e.preventDefault();
    if (!this.currentCell.note) {
      return false;
    }

    EditorActions.selectNote(this.currentCell.note, this.currentPosition);

    if (!this.onTail) {
      this.moveDrag = true;
      this.canvas.style.cursor = "move";
      EditorActions.dragNoteOverCell(this.currentPitch, this.currentPosition);
    }
    if (this.onTail) {
      this.resizeDrag = true;
      EditorActions.dragNoteOverCellForResize(this.currentPosition);
    }
  },

  onMouseUp: function(e) {
    if (this.moveDrag) {
      EditorActions.moveSelectedNoteTo(this.currentPitch,
          this.currentPosition);
    }
    if (this.resizeDrag) {
      EditorActions.resizeNoteTo(this.currentPosition);
    }
    this.moveDrag = false;
    this.resizeDrag = false;
    this.copyDrag = false;
    this.canvas.style.cursor = "crosshair";
  },

  onEnterNewCell: function() {
    if (this.moveDrag) {
      EditorActions.dragNoteOverCell(this.currentPitch, this.currentPosition);
    }
    if (this.resizeDrag) {
      EditorActions.dragNoteOverCellForResize(this.currentPosition);
    }
  },

  onScroll:function(e) {
    this.keyboard.scrollTop = this.matrix.scrollTop;
  },

  render: function() {
    var cWidth = config.CELL_WIDTH * this.state.length;
    var cHeight = config.CELL_HEIGHT * this.numPitches;

    return (
      <div className="piano-roll">
        <Keyboard
          numPitches={this.numPitches}
          height={cHeight}
        />
        <div className="matrix"
          onScroll={this.onScroll}
        >
          <canvas id="matrix-canvas"
            width={cWidth + 1}
            height={cHeight + 1}
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseMove={this.onMouseMove}
          />
        </div>
      </div>
    );
  }
});

module.exports = PianoRoll;
