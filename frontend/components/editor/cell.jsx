var React = require('react');
var ReactDOM = require('react-dom');
var EditorActions = require('../../actions/editorActions');
var EditorStore = require('../../stores/editorStore');


var Cell = React.createClass({
  getInitialState: function() {
    var pitch = this.props.pitch;
    var position = this.props.position;
    var noteData = EditorStore.getNoteCell(pitch, position) || {};

    return {
      note: noteData.note,
      type: noteData.type,
      isSelected: EditorStore.getSelectedCell(pitch, position),
      isDestination: EditorStore.getDestinationCell(pitch, position)
    };
  },

  componentWillMount: function() {
    this.listener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    var pitch = this.props.pitch;
    var position = this.props.position;
    var noteData = EditorStore.getNoteCell(pitch, position) || {};

    this.setState({
      note: noteData.note,
      type: noteData.type,
      isSelected: EditorStore.getSelectedCell(pitch, position),
      isDestination: EditorStore.getDestinationCell(pitch, position)
    });
  },

  classNames: function() {
    var classNames = [];
    if (!this.state.note) {
      classNames.push("empty");
    } else {
      classNames.push("note");
    }
    return classNames.concat(this.state.type).join(" ");
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return (this.state.note !== nextState.note) ||
      (this.state.isSelected !== nextState.isSelected) ||
      (this.state.isDestination !== nextState.isDestination);
  },

  onClick: function(e) {
    e.preventDefault();
    if (!this.state.note) {
      EditorActions.insertNote({
        pitch: this.props.pitch,
        position: this.props.position,
        duration: 1
      });
    }
  },

  onDoubleClick: function(e) {
    e.preventDefault();
    if (this.state.note) {
      EditorActions.removeNote(this.state.note);
    }
  },

  onDragStart: function(e) {
    var nullImg = document.createElement('img');
    e.dataTransfer.setDragImage(nullImg, 0, 0);

    if (this.state.note) {
      var data = {
        note: this.state.note,
        action: "move"
      };
      e.dataTransfer.setData("notedata", JSON.stringify(data));
      EditorActions.selectNoteForMove(this.state.note, this.props.position);
    } else {
      e.preventDefault();
    }
  },

  onDragEnd: function(e) {
    e.preventDefault();

    EditorActions.dragCompleted();
  },

  onDragEnter: function(e) {
    e.preventDefault();
    if (e.dataTransfer.types.indexOf("notedata") === -1) { return; }
    EditorActions.dragNoteOverCell(this.props.pitch, this.props.position);
  },

  onDragOver: function(e) {
    e.preventDefault();
  },

  onDrop: function(e) {
    try {
      var noteData = JSON.parse(e.dataTransfer.getData("notedata"));
    } catch (error) { return; }

    switch (noteData.action) {
      case "move":
        EditorActions.moveNoteTo(noteData.note, this.props.pitch, this.props.position);
        break;
    }
  },


  render: function() {
    console.log("render");
    if (this.state.type) {
      var isEndOfNote = (this.state.type.indexOf("note-end") !== -1);
    }

    var selectedClass = this.state.isSelected ? " selected" : "";
    var destinationClass = this.state.isDestination ? " destination" : "";

    return (
      <li className="matrix-cell"
        draggable="true"
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        <div className={"cell-body " +
          this.classNames() +
          selectedClass +
          destinationClass
          }
        />
        {
          isEndOfNote ?
            <div className={"note-tail " +
              selectedClass +
              destinationClass
              }
            />
            : null
        }
      </li>
    );
  }

});

module.exports = Cell;
