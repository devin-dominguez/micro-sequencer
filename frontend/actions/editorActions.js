var Dispatcher = require('../dispatcher/dispatcher');
var EditorConstants = require('../constants/editorConstants');

module.exports = {
  randomize: function() {
    Dispatcher.dispatch({
    actionType: "RANDOMIZE"
    });
  },

  insertNote: function(noteParams) {
    Dispatcher.dispatch({
      actionType: EditorConstants.INSERT_NOTE,
      noteParams: noteParams
    });
  },

  removeNote: function(noteParams) {
    Dispatcher.dispatch({
      actionType: EditorConstants.REMOVE_NOTE,
      noteParams: noteParams
    });
  },

  moveNoteTo: function(noteParams, pitch, position) {
    Dispatcher.dispatch({
      actionType: EditorConstants.MOVE_NOTE_TO,
      noteParams: noteParams,
      pitch: pitch,
      position: position
    });
  },

  resizeNoteTo: function(noteParams, duration) {
    Dispatcher.dispatch({
      actionType: EditorConstants.REISZE_NOTE_TO,
      noteParams: noteParams,
      duration: duration
    });
  },

  selectNoteForMove: function(noteParams, cellPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SELECT_NOTE_FOR_RESIZE,
      noteParams: noteParams,
      cellPosition: cellPosition
    });
  },

  dragNoteOverCell: function(cellPitch, cellPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.DRAG_NOTE_OVER_CELL,
      cellPitch: cellPitch,
      cellPosition: cellPosition
    });
  },

  dragCompleted: function() {
    Dispatcher.dispatch({
      actionType: EditorConstants.DRAG_COMPLETED
    });
  }
};
