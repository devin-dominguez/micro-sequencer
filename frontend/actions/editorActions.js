var Dispatcher = require('../dispatcher/dispatcher');
var EditorConstants = require('../constants/editorConstants');

module.exports = {

  insertNote: function(note) {
    Dispatcher.dispatch({
      actionType: EditorConstants.INSERT_NOTE,
      note: note
    });
  },

  removeNote: function(pitch, position) {
    Dispatcher.dispatch({
      actionType: EditorConstants.REMOVE_NOTE,
      pitch: pitch,
      position: position
    });
  },

  toggleNoteSelection: function(note) {
    Dispatcher.dispatch({
      actionType: EditorConstants.TOGGLE_NOTE_SELECTION,
      note: note
    });
  },

  selectNote: function(note) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SELECT_NOTE,
      note: note
    });
  },

  deselectNote: function(note) {
    Dispatcher.dispatch({
      actionType: EditorConstants.DESELECT_NOTE,
      note: note
    });
  },

  clearNoteSelection: function() {
    Dispatcher.dispatch({
      actionType: EditorConstants.CLEAR_NOTE_SELECTION,
    });
  },

  startMoveDrag: function(startPitch, startPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.START_MOVE_DRAG,
      startPitch: startPitch,
      startPosition: startPosition
    });
  },

  continueMoveDrag: function(endPitch, endPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.CONTINUE_MOVE_DRAG,
      endPitch: endPitch,
      endPosition: endPosition
    });
  },

  completeMoveDrag: function(copying) {
    Dispatcher.dispatch({
      actionType: EditorConstants.COMPLETE_MOVE_DRAG,
      copying: copying
    });
  },

  startResizeDrag: function(startPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.START_RESIZE_DRAG,
      startPosition: startPosition
    });
  },

  continueResizeDrag: function(endPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.CONTINUE_RESIZE_DRAG,
      endPosition: endPosition
    });
  },

  completeResizeDrag: function() {
    Dispatcher.dispatch({
      actionType: EditorConstants.COMPLETE_RESIZE_DRAG
    });
  },

  addTrack: function() {
    Dispatcher.dispatch({
      actionType: EditorConstants.ADD_TRACK
    });
  },

  resizePattern: function(patternId, newSize) {
    Dispatcher.dispatch({
      actionType: EditorConstants.RESIZE_PATTERN,
      patternId: patternId,
      newSize: newSize
    });
  },

  removeTrack: function(trackIdx) {
    Dispatcher.dispatch({
      actionType: EditorConstants.REMOVE_TRACK,
      trackIdx: trackIdx
    });
  },

  selectKey: function(keyPitch) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SELECT_KEY,
      keyPitch: keyPitch
    });
  },

  setTempo: function(tempo) {
    tempo = Math.min(320, Math.max(30, tempo));
    Dispatcher.dispatch({
      actionType: EditorConstants.SET_TEMPO,
      tempo: tempo
    });
  },

  updateCompositionSettings: function(newParams) {
    Dispatcher.dispatch({
      actionType: EditorConstants.UPDATE_COMPOSITION_SETTINGS,
      newParams: newParams
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
