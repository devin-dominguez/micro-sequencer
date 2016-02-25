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
    this. setState({
      phrase: EditorStore.phrase()
    });
  },

  matrix: function() {
    var rows = [];
    for (var pitch = SeqConfig.MIN_PITCH; pitch <= SeqConfig.MAX_PITCH; pitch++) {
      rows[pitch] = [];
      for (var tick = 0; tick < this.state.phrase.length; tick++) {
        rows[pitch][tick] = ( <Cell key={tick} position={tick} pitch={pitch} /> );
      }
    }
    return (
      rows.reverse().map(function(row, i) {
        return <ul key={i} className="matrix-row">{row}</ul> ;
      })
    );
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return this.state.phrase.length !== nextState.phrase.length;
  },

  render: function() {
    return (
      <div className="piano-roll">
        <ul className="matrix" onClick={this.onClick}>
          {this.matrix()}
        </ul>
      </div>
    );
  }

});

module.exports = PianoRoll;
