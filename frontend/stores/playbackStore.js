var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var PlaybackConstants = require('../constants/playbackConstants');
var EditorConstants = require('../constants/editorConstants');
var CompositionConstants = require('../constants/compositionConstants');
var Playback = require('../seqApi/playback');

var _playback = new Playback();
_playback.loadComposition();

var _isPlaying = false;
var _isStopped = true;

var PlaybackStore = new Store(Dispatcher);

PlaybackStore.__onDispatch =  function(payload) {
  switch (payload.actionType) {
    case PlaybackConstants.DEMO_NOTE_ON:
      _playback.demoVoiceOn(payload.pitch);
      break;

    case PlaybackConstants.DEMO_NOTE_OFF:
      _playback.demoVoiceOff();
      break;

    case PlaybackConstants.PLAY:
      _playback.play();
      _isPlaying = true;
      _isStopped = false;
      this.__emitChange();
      break;

    case PlaybackConstants.PAUSE:
      _playback.pause();
      _isPlaying = false;
      _isStopped = false;
      this.__emitChange();
      break;

    case PlaybackConstants.STOP:
      _playback.stop();
      _isPlaying = false;
      _isStopped = true;
      this.__emitChange();
      break;

    case CompositionConstants.LOAD_COMPOSITION:
    case CompositionConstants.CREATE_COMPOSITION:
    case CompositionConstants.UPDATE_COMPOSITION:
    case CompositionConstants.NEW_COMPOSITION:
      _playback.loadComposition();
      break;

    case PlaybackConstants.TICK:
      this.__emitChange();
  }
};

PlaybackStore.isPlaying = function() {
  return _isPlaying;
};

PlaybackStore.isStopped = function() {
  return _isStopped;
};

PlaybackStore.playback = function () {
  return _playback;
};

PlaybackStore.currentTick = function() {
  return _playback.currentTick - 1;
};

module.exports = PlaybackStore;
