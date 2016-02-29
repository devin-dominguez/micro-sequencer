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

function SynthRunner(synth, track, audio) {
  this.synth = synth;
  this.audio = audio;
  this.track = track;
}

///////////////
// INTERFACE //
///////////////

SynthRunner.prototype.noteOn = function(pitch, time) {
  time = time || this.audio.currentTime;

  var freq = mtof[pitch];
  var voice = new Voice(this.track, this.audio);

  voice._noteOn(this.synth, freq, time);

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

module.exports = SynthRunner;
