var SynthRunner = require('./synthRunner');
var EditorStore = require('../stores/editorStore');
var PlaybackActions = require('../actions/playbackActions');

var audio = new window.AudioContext();
var track = audio.createGain();
track.gain.value = .25;
track.connect(audio.destination);

var _lookAhead = 0.1;
var _interval = 0.1;

function Playback() {
  this.playbackQueue = {};
  this.tickDuration = 0.1;
  this.currentTick = 0;

  this.nextNoteTime = 0;
  this.isPlaying = false;

  this.listener = EditorStore.addListener(this.onChange.bind(this));
}

Playback.prototype.onChange = function() {
  if (this.phrase) {
    this.buildPlaybackQueue();
  }
};

Playback.prototype.loadComposition = function() {
  var composition = EditorStore.composition();
  this.phrase = composition.phrase;
  this.synthRunner = new SynthRunner(composition.playBackSettings.synth, track, audio);
  this.playBackSettings = composition.playBackSettings;
};

Playback.prototype.play = function() {
  if (!this.isPlaying) {
    this.nextNoteTime = audio.currentTime;
    this.isPlaying = true;
    this.buildPlaybackQueue();
    this.intervalId = window.setInterval(this._scheduler.bind(this), _interval);
  }
};

Playback.prototype.pause = function() {
  if (this.isPlaying) {
    this.isPlaying = false;
    window.clearInterval(this.intervalId);
  }
};

Playback.prototype.stop = function() {
  this.pause();
  this.currentTick = 0;
};

Playback.prototype.demoVoiceOn = function(pitch) {
  this.demoVoiceOff();
  this.demoVoice = this.synthRunner.noteOn(pitch);
};

Playback.prototype.demoVoiceOff = function() {
  if (this.demoVoice) {
    this.synthRunner.noteOff(this.demoVoice);
    this.demoVoice = null;
  }
};

Playback.prototype._incrementTick = function() {
  this.tickDuration =  60 / this.playBackSettings.tempo / 4;
  this.nextNoteTime += this.tickDuration;
  this.currentTick = (this.currentTick + 1) % this.phrase.length;

  PlaybackActions.tick();
};

Playback.prototype. _scheduler = function() {
  while (this.nextNoteTime < audio.currentTime + _lookAhead) {

    if (this.playbackQueue[this.currentTick]) {
      var idx = 0;

      while (this.playbackQueue[this.currentTick][idx]) {
        var note = this.playbackQueue[this.currentTick][idx];
        this.synthRunner.scheduleNote(note.pitch,
            note.duration * this.tickDuration,
            this.nextNoteTime);
        idx++;
      }
    }
    this._incrementTick();
  }
};

Playback.prototype.buildPlaybackQueue = function() {
  this.playbackQueue = {};
  this.phrase.notes.forEach(function(note) {
    if (!this.playbackQueue[note.position]) {
      this.playbackQueue[note.position] = [note];
    } else {
      this.playbackQueue[note.position].push(note);
    }
  }, this);
};


module.exports = Playback;
