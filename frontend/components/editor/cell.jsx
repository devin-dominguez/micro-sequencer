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

  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.props.note === nextProps.note) {
      return false;
    }
    return true;
  },

  noteBody: function() {
    if (this.props.note) {
      return [
        <div className= "note-body"
          key="1"
          draggable="true"
          onDragStart={this.moveDrag}/>,

        <div className="note-tail"
          key="2"
          draggable="true"
          onDragStart={this.resizeDrag}/>
      ];
    }
  },

  moveDrag: function(e) {
    var data = this.props.note;
    data.action = "move";
    e.dataTransfer.setData("note", JSON.stringify(data));
  },

  resizeDrag: function(e) {
    var data = this.props.note;
    data.action = "resize";
    e.dataTransfer.setData("note", JSON.stringify(data));

  },

  moveDrop: function(e) {
    e.preventDefault();
    var data = e.dataTransfer.getData("note");
    if (data) {
      var note = JSON.parse(data);
      var pitch = this.props.pitch;
      var position = this.props.position;
      if (note.action === "move") {
        EditorActions.moveNoteTo(note, pitch, position);
      } else if (note.action === "resize") {
        var newDuration = position - note.position + 1;
        EditorActions.resizeNoteTo(note, newDuration);
      }
    }
  },

  moveDragOver: function(e) {
    e.preventDefault();
  },

  render: function() {
    var className = "matrix-cell " + this.props.type;
    if (this.props.note && this.props.note.duration === 1) {
      className += " note-off";
    }
    return (
      <li onClick={this.onClick}
      onDoubleClick={this.onDoubleClick}
      onDrop={this.moveDrop}
      onDragOver={this.moveDragOver}
      className={className}>
        {this.noteBody()}
      </li>
    );
  }

});

module.exports = Cell;
