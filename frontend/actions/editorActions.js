var Dispatcher = require('../dispatcher/dispatcher');
var EditorConstants = require('../constants/editorConstants');

module.exports = {

  insertNote(note) {
    Dispatcher.dispatch({
      actionType: EditorConstants.INSERT_NOTE,
      note: note
    });
  },

  removeNote(pitch, position) {
    Dispatcher.dispatch({
      actionType: EditorConstants.REMOVE_NOTE,
      pitch: pitch,
      position: position
    });
  },

  toggleNoteSelection(note) {
    Dispatcher.dispatch({
      actionType: EditorConstants.TOGGLE_NOTE_SELECTION,
      note: note
    });
  },

  selectNote(note) {
    Dispatcher.dispatch({
      actionType: EditorConstants.SELECT_NOTE,
      note: note
    });
  },

  deselectNote(note) {
    Dispatcher.dispatch({
      actionType: EditorConstants.DESELECT_NOTE,
      note: note
    });
  },

  clearNoteSelection() {
    Dispatcher.dispatch({
      actionType: EditorConstants.CLEAR_NOTE_SELECTION,
    });
  },

  startMoveDrag(startPitch, startPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.START_MOVE_DRAG,
      startPitch: startPitch,
      startPosition: startPosition
    });
  },

  continueMoveDrag(endPitch, endPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.CONTINUE_MOVE_DRAG,
      endPitch: endPitch,
      endPosition: endPosition
    });
  },

  completeMoveDrag(copying) {
    Dispatcher.dispatch({
      actionType: EditorConstants.COMPLETE_MOVE_DRAG,
      copying: copying
    });
  },

  startResizeDrag(startPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.START_RESIZE_DRAG,
      startPosition: startPosition
    });
  },

  continueResizeDrag(endPosition) {
    Dispatcher.dispatch({
      actionType: EditorConstants.CONTINUE_RESIZE_DRAG,
      endPosition: endPosition
    });
  },

  completeResizeDrag() {
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
