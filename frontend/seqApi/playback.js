var SynthRunner = require('./synthRunner');
var EditorStore = require('../stores/editorStore');
var PlaybackActions = require('../actions/playbackActions');

var audio = new window.AudioContext();
var masterTrack = audio.createGain();
masterTrack.gain.value = .25;
masterTrack.connect(audio.destination);

var _lookAhead = 0.1;
var _interval = 0.1;

function Playback() {
  this.channels = [];

  this.playbackQueue = {};
  this.tickDuration = 0.1;
  this.currentTick = 0;

  this.nextNoteTime = 0;
  this.isPlaying = false;

  this.listener = EditorStore.addListener(this.onChange.bind(this));

  this.patternLoop = false;
}

Playback.prototype.panic = function() {
  this.synthRunners.forEach(function(synthRunner) {
    synthRunner.panic();
  });
};

Playback.prototype.onChange = function() {
  if (this.patterns) {
    this.buildPlaybackQueue();
    this.channels.forEach(function(channel, idx) {
      channel.gain.value = this.composition.tracks[idx].volume;
    }, this);
  }
};

Playback.prototype.disconnectChannels = function() {
  this.channels.forEach(function(channel) {
    channel.disconnect();
  });
  this.channels = [];
};

Playback.prototype.loadComposition = function() {
  this.composition = EditorStore.composition();
  this.sequence = this.composition.sequence;
  this.patterns = this.composition.patterns;
  this.settings = this.composition.settings;

  this.populateTracks();
};

Playback.prototype.populateTracks = function() {
  this.disconnectChannels();

  this.synthRunners = this.composition.tracks.map(function(track, idx) {
    this.channels[idx] = audio.createGain();
    this.channels[idx].connect(audio.destination);
    this.channels[idx].gain.value = track.volume;
    return new SynthRunner(track, audio, this.channels[idx]);
  }, this);

  this.seqPosition = 0;
  this.currentPattern = this.sequence[0];
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
  this.panic();
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
  var trackIdx = EditorStore.currentTrackIdx();
  this.demoVoiceOff();
  this.demoVoice = this.synthRunners[trackIdx].noteOn(pitch);
};

Playback.prototype.demoVoiceOff = function() {
  var trackIdx = EditorStore.currentTrackIdx();
  if (this.demoVoice) {
    this.synthRunners[trackIdx].noteOff(this.demoVoice);
    this.demoVoice = null;
  }
};

Playback.prototype._incrementTick = function() {
  this.tickDuration =  60 / this.settings.tempo / this.settings.tpb;
  this.nextNoteTime += this.tickDuration;
  this.currentTick++;

  if (this.currentTick >= this.patterns[this.currentPattern].length) {
    this.currentTick = 0;
    if (!this.patternLoop) {
      this.seqPosition = (this.seqPosition + 1) % this.sequence.length;
      this.currentPattern = this.sequence[this.seqPosition];
    }
  }

  PlaybackActions.tick();
};

Playback.prototype. _scheduler = function() {
  while (this.nextNoteTime < audio.currentTime + _lookAhead) {
    this.playbackQueues.forEach(function(playbackQueue, trackIdx) {
      if (playbackQueue[this.currentTick]) {
        var idx = 0;

        while (playbackQueue[this.currentTick][idx]) {
          var note = playbackQueue[this.currentTick][idx];
          this.synthRunners[trackIdx].scheduleNote(note.pitch,
              note.duration * this.tickDuration,
              this.nextNoteTime);
          idx++;
        }
      }
    }, this);


    this._incrementTick();
  }
};

Playback.prototype.buildPlaybackQueue = function() {
  this.playbackQueues = [];

  this.patterns[this.currentPattern].phrases.forEach(function(phrase, trackIdx) {
    this.playbackQueues[trackIdx] = {};
    phrase.notes.forEach(function(note) {
      if (!this.playbackQueues[trackIdx][note.position]) {
        this.playbackQueues[trackIdx][note.position] = [note];
      } else {
        this.playbackQueues[trackIdx][note.position].push(note);
      }
    }, this);
  }, this);
};


module.exports = Playback;
