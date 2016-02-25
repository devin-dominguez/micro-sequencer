var React = require('react');
var ReactDOM = require('react-dom');
var EditorStore = require('../../stores/editorStore');
var EditorActions = require('../../actions/editorActions');

var Cell = React.createClass({
  getInitialState: function() {
    return {
      note: null,
      dragged: false
    };
  },

  componentWillMount: function() {
    this.listener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    this.findSelf();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return (this.state.note !== nextState.note) || (this.state.dragged !== nextState.dragged);
  },

  findSelf: function() {
    var selfNote = null;

    var notes = EditorStore.phrase().notes;
    for (var i = 0, l = notes.length; i < l; i++) {
      var note = notes[i];
      if (note.position === this.props.position &&
          note.pitch === this.props.pitch) {
        selfNote = note;
      }
    }
    this. setState({
      note: selfNote
    });
  },

  addNoteOnClick: function(e) {
    e.preventDefault();
    var noteParams = {
      pitch: this.props.pitch,
      position: this.props.position,
      duration: 1
    };
    EditorActions.insertNote(noteParams);
  },

  removeNoteOnDoubleClick: function(e) {
    e.preventDefault();
    EditorActions.removeNote(this.state.note);
  },

  moveNoteOnDragStart: function(e) {
    var node = ReactDOM.findDOMNode(this).firstChild;
    //node.style.pointerEvents = "none";



    var data = {
      note: this.state.note,
      action: "move"
    };

    e.dataTransfer.setData("noteData", JSON.stringify(data));
    e.dataTransfer.dropEffect = "move";

    this.setState({
      dragged: true
    });

  },

  resizeNoteOnDragStart: function(e) {
    e.stopPropagation();
    var data = {
      note: this.state.note,
      action: "resize"
    };

    e.dataTransfer.setData("noteData", JSON.stringify(data));
  },

  changeNoteOnDragOver: function(e) {
    e.preventDefault();
    console.log("!");
  },

  changeNoteOnDrop: function(e) {
    e.preventDefault();

    var data = JSON.parse(e.dataTransfer.getData("noteData"));
    switch (data.action) {
      case "move":
        EditorActions.moveNoteTo(data.note, this.props.pitch, this.props.position);
        break;
      case "resize":
        var newDuration = this.props.position - data.note.position + 1;
        EditorActions.resizeNoteTo(data.note, newDuration);
    }
  },

  preventDefault: function(e) {
    e.preventDefault();
  },

  noteContent: function() {
    if (this.state.note !== null) {
      var width = this.state.note.duration * 100 + "%";

      return (
        <div className="note"
        style={{width: width}}
        onDoubleClick={this.removeNoteOnDoubleClick}
        draggable="true"
        onDragStart={this.moveNoteOnDragStart}
        onDragOver={this.preventDefault}
        onDrop={this.preventDefault}
        >

          <div className="note-body"
          />

          <div className="note-tail"
          draggable="true"
          onDragStart={this.resizeNoteOnDragStart}
          onDragOver={this.preventDefault}
          onDrop={this.preventDefault}
          />

        </div>
      );
    }

    return (
        <div className="null-note"
        onClick={this.addNoteOnClick}
        onDragOver={this.changeNoteOnDragOver}
        onDrop={this.changeNoteOnDrop}
        />
      );
  },

  render: function() {
    console.log("RERENDER");
    //if (this.state.dragged) {
      //var style = {
        //zIndex: "-1"
      //};
    //}

    return (
      <li className="matrix-cell"
      >
        {this.noteContent()}
      </li>
    );
  }

});

module.exports = Cell;
