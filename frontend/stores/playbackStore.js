var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var PlaybackConstants = require('../constants/playbackConstants');
var CompositionConstants = require('../constants/compositionConstants');
var EditorStore = require('../stores/editorStore');


var _isPlaying = false;
var _isStopped = true;
var _shouldLoad = false;
var _currentTick = -1;

var _demoPitch = null;

var PlaybackStore = new Store(Dispatcher);

PlaybackStore.__onDispatch =  function(payload) {
  switch (payload.actionType) {
    case CompositionConstants.LOAD_COMPOSITION:
    case CompositionConstants.CREATE_COMPOSITION:
    case CompositionConstants.UPDATE_COMPOSITION:
    case CompositionConstants.NEW_COMPOSITION:
      _shouldLoad = true;
      this.__emitChange();
      break;

    case CompositionConstants.COMPOSITION_LOADED:
      _shouldLoad = false;
      this.__emitChange();
      break;

    case PlaybackConstants.DEMO_NOTE_ON:
      _demoPitch = payload.pitch;
      this.__emitChange();
      break;

    case PlaybackConstants.DEMO_NOTE_OFF:
      _demoPitch = null;
      this.__emitChange();
      break;

    case PlaybackConstants.PLAY:
      _isPlaying = true;
      _isStopped = false;
      this.__emitChange();
      break;

    case PlaybackConstants.PAUSE:
      _isPlaying = false;
      _isStopped = false;
      this.__emitChange();
      break;

    case PlaybackConstants.STOP:
      _isPlaying = false;
      _isStopped = true;
      _currentTick = 0;
      this.__emitChange();
      break;

    case PlaybackConstants.TICK:
      _currentTick = payload.tick;
      this.__emitChange();
      break;
  }
};

PlaybackStore.demoPitch = function() {
  return _demoPitch;
};

PlaybackStore.shouldLoad = function() {
  var action = _shouldLoad;
  _shouldLoad = false;
  return action;
};

PlaybackStore.isPlaying = function() {
  return _isPlaying;
};

PlaybackStore.isStopped = function() {
  return _isStopped;
};

PlaybackStore.currentTick = function() {
  return _currentTick;
};

module.exports = PlaybackStore;
