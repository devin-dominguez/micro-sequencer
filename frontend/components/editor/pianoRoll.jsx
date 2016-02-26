var React = require('react');
var EditorStore = require('../../stores/editorStore');
var SeqConfig = require('../../seqApi/config');
var Cell = require('./cell');

var PianoRoll = React.createClass({
  getInitialState: function() {
    return {
      length: EditorStore.phraseLength()
    };
  },

  componentWillMount: function() {
    this.listener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    this.setState({
      length: EditorStore.phraseLength()
    });
  },

  matrixCells: function() {
    var matrixRows = [];
    for (var pitch = SeqConfig.MIN_PITCH; pitch <= SeqConfig.MAX_PITCH; pitch++) {
      matrixRows.unshift(this.matrixRow(pitch));
    }

    return <div className="matrix">{matrixRows}</div>;
  },

  matrixRow: function(pitch) {
    var row = [];
    for (var position = 0; position < this.state.length; position++) {
      row.push( <Cell pitch={pitch} position={position} key={position} />);
    }

    return <ul className="matrix-row" key={pitch}>{row}</ul>;
  },

  render: function() {
    return (
      <div className="piano-roll">
        {this.matrixCells()}
      </div>
    );
  }

});

module.exports = PianoRoll;
