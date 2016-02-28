var Dispatcher = require('../dispatcher/dispatcher');
var EditorConstants = require('../constants/editorConstants');

module.exports = {
  loadPhrase: function(phrase) {
    Dispatcher.dispatch({
      actionType: EditorConstants.LOAD_PHRASE,
      phrase: phrase
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

  moveSelectedNoteTo: function(pitch, position) {
    Dispatcher.dispatch({
      actionType: EditorConstants.MOVE_NOTE_TO,
      pitch: pitch,
      position: position
    });
  },

  resizeNoteTo: function(endPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.REISZE_NOTE_TO,
      endPosition: endPosition
    });
  },

  selectNoteForMove: function(noteParams, cellPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SELECT_NOTE_FOR_MOVE,
      noteParams: noteParams,
      cellPosition: cellPosition
    });
  },

  selectNote: function(noteParams, cellPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SELECT_NOTE,
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

  dragNoteOverCellForResize: function(cellPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.DRAG_NOTE_OVER_CELL_FOR_RESIZE,
      cellPosition: cellPosition
    });
  },

  dragCompleted: function() {
    Dispatcher.dispatch({
      actionType: EditorConstants.DRAG_COMPLETED
    });
  }
};
