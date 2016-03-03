var Dispatcher = require('../dispatcher/dispatcher');
var EditorConstants = require('../constants/editorConstants');

module.exports = {
  loadComposition: function(compositionId) {
    var ajaxOptions = {
      url: "api/compositions/" +  compositionId,
      type: "GET",
      success: function(composition) {
        var successAction = {
          actionType: EditorConstants.LOAD_COMPOSITION,
          composition: composition
        };
      Dispatcher.dispatch(successAction);
      },
      //error: failure
    };

    $.ajax(ajaxOptions);
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
  },

  selectKey: function(keyPitch) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SELECT_KEY,
      keyPitch: keyPitch
    });
  },

  setTempo: function(tempo) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SET_TEMPO,
      tempo: tempo
    });
  },

  updateSynth: function(trackIdx, synthParams) {
    Dispatcher.dispatch({
      actionType: EditorConstants.UPDATE_SYNTH,
      trackIdx: trackIdx,
      synthParams: synthParams
    });
  },

  selectTrack: function(trackIdx) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SELECT_TRACK,
      trackIdx: trackIdx,
    });
  },

};
