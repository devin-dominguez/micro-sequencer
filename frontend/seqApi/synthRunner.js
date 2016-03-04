var Voice = require('./voice');

//////////////
// CREATION //
//////////////

var mtof = [];
(function (tuning) {
  for (var i = 0; i < 128; i++) {
    mtof[i] = Math.pow(2, (i - 69) / 12) * tuning;
  }
})(440);

function SynthRunner(synth, audio, channel) {
  this.synth = synth;
  this.audio = audio;

  this.channel = channel;

  this.voices = {};
}

///////////////
// INTERFACE //
///////////////

SynthRunner.prototype.noteOn = function(pitch, time) {
  time = time || this.audio.currentTime;

  var freq = mtof[pitch];
  var voice = new Voice(this.channel, this.audio, this.voiceDone.bind(this));

  voice._noteOn(this.synth, freq, time);

  this.voices[voice.idx] = voice;
  return voice;
};

SynthRunner.prototype.noteOff = function(voice, time) {
  time = time || this.audio.currentTime;
  voice._noteOff(this.synth, time);
};

SynthRunner.prototype.scheduleNote = function(pitch, duration, time) {
  time = time || this.audio.currentTime;
  var endTime = time + duration;

  var voice = this.noteOn(pitch, time);
  this.noteOff(voice, endTime);
};

SynthRunner.prototype.panic = function() {
  Object.keys(this.voices).forEach(function(voiceIdx) {
    this.voices[voiceIdx]._noteOff(this.synth, this.audio.currentTime);
  }, this);
};

SynthRunner.prototype.voiceDone = function(voiceIdx) {
  delete this.voices[voiceIdx];
};

module.exports = SynthRunner;
