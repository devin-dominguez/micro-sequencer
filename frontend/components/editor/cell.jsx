var React = require('react');
var EditorStore = require('../../stores/editorStore');
var EditorActions = require('../../actions/editorActions');

var Cell = React.createClass({
  getInitialState: function() {
    return {
      note: null
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
    return this.state.note !== nextState.note;
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

  noteContent: function() {

    if (this.state.note !== null) {
      var width = this.state.note.duration * 100 + "%";
      return (
        <div className="note"
        style={{width: width}}
        onDoubleClick={this.removeNoteOnDoubleClick}>
          <div className="note-body" />
          <div className="note-tail" />
        </div>
      );
    }
    return <div className="null-note" onClick={this.addNoteOnClick}/>;
  },

  render: function() {
    return (
      <li className="matrix-cell">
        {this.noteContent()}
      </li>
    );
  }

});

module.exports = Cell;
