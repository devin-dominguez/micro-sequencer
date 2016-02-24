var React = require('react');
var EditorStore = require('../../stores/editorStore');
var SeqConfig = require('../../seqApi/config');
var Cell = require('./cell');

var PianoRoll = React.createClass({
  getInitialState: function() {
    return {
      phrase: EditorStore.phrase()
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
      phrase: EditorStore.phrase()
    });
  },

  buildRow: function(pitch) {
    var row = [];
    var notesForRow = {};
    this.state.phrase.notes.forEach(function(note) {
      if (note.pitch === pitch) {
        notesForRow[note.position] = note;
      }
    });

    for (var tick = 0; tick < this.state.phrase.length; tick++) {
      var note = notesForRow[tick];
      if (note) {
        row[tick] = (<Cell note={note}
            key={tick}
            type="note-on"
            pitch={pitch}
            position={tick} />);

        var duration = note.duration - 1;

        while (duration > 1) {
          row[++tick] = (<Cell note={note}
            key={tick}
            type="note-continue"
            pitch={pitch}
            position={tick} />);
          duration--;
        }

        if (duration === 1) {
        row[++tick] = (<Cell note={note}
          key={tick}
          type="note-off"
          pitch={pitch}
          position={tick} />);
        }

      } else {
        row[tick] = (<Cell note={null}
          key={tick}
          type="null"
          pitch={pitch}
          position={tick} />);
      }
    }

    return <ul className={"matrix-row"} >{row}</ul>;
  },

  matrixRows: function() {
    var rows = [];
    for (var pitch = SeqConfig.MAX_PITCH; pitch >= SeqConfig.MIN_PITCH; pitch--) {
      rows.push(<li key={pitch}>{this.buildRow(pitch)}</li>);
    }

    return rows;
  },

  render: function() {
    return (
      <div className="piano-roll">
        <ul className="matrix" onClick={this.onClick}>
          {this.matrixRows()}
        </ul>
      </div>
    );
  }

});

module.exports = PianoRoll;
