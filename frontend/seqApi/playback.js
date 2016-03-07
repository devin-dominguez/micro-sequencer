var SynthRunner = require('./synthRunner');
var EditorStore = require('../stores/editorStore');
var PlaybackStore = require('../stores/playbackStore');
var PlaybackActions = require('../actions/playbackActions');

var audio = window.AudioContext || window.webkitAudioContext;
var _audio = new audio();
var _masterTrack = _audio.createGain();
_masterTrack.gain.value = 0.25;
_masterTrack.connect(_audio.destination);

var _lookAhead = 0.05;

function Playback() {
  this.channels = [];

  this.playbackQueue = {};
  this.tickDuration = 0.1;
  this.currentTick = 0;

  this.nextNoteTime = 0;
  this.isPlaying = false;

  EditorStore.addListener(this.onCompositionChange.bind(this));
  PlaybackStore.addListener(this.onPlaybackChange.bind(this));

  this.patternLoop = false;
}

Playback.prototype.panic = function() {
  this.synthRunners.forEach(function(synthRunner) {
    synthRunner.panic();
  });
};

Playback.prototype.onCompositionChange = function() {
  if (this.composition) {

    if (this.channels.length !== this.composition.tracks.length) {
      this.populateTracks();
    }

    this.buildPlaybackQueue();
    this.channels.forEach(function(channel, idx) {
      channel.gain.value = this.composition.tracks[idx].volume;
    }, this);
  }
};

Playback.prototype.onPlaybackChange = function() {
  if (PlaybackStore.shouldLoad()) {
    this.loadComposition(EditorStore.composition());
  }

  if (PlaybackStore.demoPitch()) {
    this.demoVoiceOn(PlaybackStore.demoPitch());
  } else {
    this.demoVoiceOff();
  }

  if (PlaybackStore.isPlaying()) {
    this.play();
  } else {
    this.stop();
  }

  if (PlaybackStore.isStopped()) {
    this.stop();
    this.rewind();
  }
};

Playback.prototype.disconnectChannels = function() {
  this.channels.forEach(function(channel) {
    channel.disconnect();
  });
  this.channels = [];
};

Playback.prototype.loadComposition = function(composition) {
  this.composition = composition;
  this.sequence = this.composition.sequence;
  this.patterns = this.composition.patterns;
  this.settings = this.composition.settings;

  this.populateTracks();
};

Playback.prototype.populateTracks = function() {
  this.disconnectChannels();

  this.synthRunners = this.composition.tracks.map(function(track, idx) {
    this.channels[idx] = _audio.createGain();
    this.channels[idx].connect(_audio.destination);
    this.channels[idx].gain.value = track.volume;
    return new SynthRunner(track, _audio, this.channels[idx]);
  }, this);

  this.seqPosition = 0;
  this.currentPattern = this.sequence[0];
};

Playback.prototype.play = function() {
  if (!this.isPlaying) {
    this.nextNoteTime = _audio.currentTime;
    this.isPlaying = true;
    this.buildPlaybackQueue();

    window.requestAnimationFrame(this.scheduler.bind(this));
  }
};

Playback.prototype.stop = function() {
  if (this.isPlaying) {
    this.panic();
    this.isPlaying = false;
  }
};

Playback.prototype.rewind = function() {
  this.currentTick = 0;
};

Playback.prototype.demoVoiceOn = function(pitch) {
  if (!this.demoVoice) {
    var trackIdx = EditorStore.currentTrackIdx();
    this.demoVoiceOff();
    this.demoVoice = this.synthRunners[trackIdx].noteOn(pitch);
  }
};

Playback.prototype.demoVoiceOff = function() {
  var trackIdx = EditorStore.currentTrackIdx();
  if (this.demoVoice) {
    this.synthRunners[trackIdx].noteOff(this.demoVoice);
    this.demoVoice = null;
  }
};

Playback.prototype.incrementTick = function() {
  PlaybackActions.tick(this.currentTick);

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

};

Playback.prototype.scheduler = function() {
  while (this.nextNoteTime < _audio.currentTime + _lookAhead) {
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


    this.incrementTick();
  }

  if (this.isPlaying) {
    window.requestAnimationFrame(this.scheduler.bind(this));
  }
};

Playback.prototype.buildPlaybackQueue = function() {
  this.playbackQueues = [];

  this.patterns[this.currentPattern].phrases.forEach(function(phrase, trackIdx) {
    this.playbackQueues[trackIdx] = {};
    Object.keys(phrase.notes).forEach(function(noteKey) {
      var note = phrase.notes[noteKey];
      if (!this.playbackQueues[trackIdx][note.position]) {
        this.playbackQueues[trackIdx][note.position] = [note];
      } else {
        this.playbackQueues[trackIdx][note.position].push(note);
      }
    }, this);
  }, this);
};


module.exports = Playback;
