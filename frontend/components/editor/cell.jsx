var React = require('react');
var EditorActions = require('../../actions/editorActions');

var Cell = React.createClass({

  onClick: function(e) {
    e.preventDefault();
    if (this.props.note === null) {
      var newNote = {
        pitch: this.props.pitch,
        position: this.props.position,
        duration: 1
      };
      EditorActions.insertNote(newNote);
    }
  },

  onDoubleClick: function(e) {
    e.preventDefault();
    if (this.props.note) {
      EditorActions.removeNote(this.props.note);
    }
  },

  render: function() {
    var className = "matrix-cell " + this.props.type;
    if (this.props.note && this.props.note.duration === 1) {
      className += " note-off";
    }
    return (
      <li onClick={this.onClick} onDoubleClick={this.onDoubleClick} className={className}>

      </li>
    );
  }

});

module.exports = Cell;
