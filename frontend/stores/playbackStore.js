var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var PlaybackConstants = require('../constants/playbackConstants');

var EditorStore = require('./editorStore');

var SynthRunner = require('../seqApi/synthRunner');

window.audio = new AudioContext();
window.track1 = window.audio.createGain();
window.track1.gain.value = 0.25;
window.track1.connect(window.audio.destination);

window.synth = {
  type: "square",
  attackTime: .1,
  decayTime: .5,
  sustainLevel: .25,
  releaseTime: 1,

};

var _tempo = 125;
var _demoVoice = null;
var _currentSynthRunner = new SynthRunner(window.synth,
    window.track1,
    window.audio);

function _demoVoiceOn(pitch) {
  _demoVoiceOff();
  _demoVoice = _currentSynthRunner.noteOn(pitch);
}

function _demoVoiceOff() {
  if (_demoVoice) {
    _currentSynthRunner.noteOff(_demoVoice);
    _demoVoice = null;
  }
}

var PlaybackStore = new Store(Dispatcher);

PlaybackStore.__onDispatch =  function(payload) {
  switch (payload.actionType) {
    case PlaybackConstants.DEMO_NOTE_ON:
      _demoVoiceOn(payload.pitch);
      break;

    case PlaybackConstants.DEMO_NOTE_OFF:
      _demoVoiceOff();
      break;
  }
};

var _noteQueue = [];
var _startTime = 0;
var _tickDuration = .1;
var _lookAhead = 0.1;
var _currentTick = 0;

var _nextNoteTime = 0;
var _queue = [];

window.playing = false;

PlaybackStore.badPlay = function() {
  var notes = EditorStore.phrase().notes;
  notes.forEach(function(note) {
    _currentSynthRunner.scheduleNote(note.pitch,
        note.duration * _tickDuration,
        note.position * _tickDuration + window.audio.currentTime);
  });
};

function _incrementTicks() {
  _nextNoteTime += _tickDuration;
  _currentTick = (_currentTick + 1) % EditorStore.phraseLength();
}

function _scheduler() {
  if (!_noteQueue.length) {
    _noteQueue = EditorStore.phrase().notes.slice();
  }

  while (_nextNoteTime < window.audio.currentTime + _lookAhead) {
    while (_noteQueue.length && _noteQueue[0].position === _currentTick) {
      var note = _noteQueue.shift();
      _currentSynthRunner.scheduleNote(note.pitch,
          note.duration * _tickDuration,
          _nextNoteTime);
    }
    _incrementTicks();
  }
}

PlaybackStore.play = function() {
  _nextNoteTime = window.audio.currentTime;
  window.setInterval(_scheduler, 0.5);
};


module.exports = PlaybackStore;
