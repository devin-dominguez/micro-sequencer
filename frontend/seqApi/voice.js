//////////////
// CREATION //
//////////////

var idx = 0;

function Voice(track, audio, callback) {
  this.idx = idx++;
  this.track = track;
  this.audio = audio;
  this.callback = callback;

  this._connect();
}

///////////////
// INTERFACE //
///////////////

/////////////
// METHODS //
/////////////

Voice.prototype._connect = function() {
  this.osc = this.audio.createOscillator();

  this.amp = this.audio.createGain();

  this.osc.connect(this.amp);
  this.amp.connect(this.track);
};

Voice.prototype._disconnect = function() {
  this.osc.stop = this.osc.stop || this.osc.noteOff;
  this.osc.stop(0);
  this.osc.disconnect();
  this.amp.disconnect();

  if (this.callback) {
    this.callback(this.idx);
  }
};

Voice.prototype._noteOn = function(synth, freq, time) {
  time += 0.0125;
  this.amp.gain.setValueAtTime(0, time);
  this.osc.type = synth.type;

  this.osc.start = this.osc.start || this.osc.noteOn;
  this.osc.start(time);

  this.osc.frequency.setValueAtTime(freq, time);

  var attackConstant = (synth.attackTime * 2) / 10;
  this.amp.gain.setTargetAtTime(1, time, attackConstant);

  var decayConstant = (synth.decayTime * 2) / 10;
  this.amp.gain.setTargetAtTime(synth.sustainLevel * synth.sustainLevel,
      time + synth.attackTime, decayConstant);

  this.finishTime = time + synth.attackTime + synth.decayTime;
};

Voice.prototype._noteOff = function(synth, time) {
  time += 0.0125;
  var releaseConstant = (synth.releaseTime * 2) / 10;

  this.amp.gain.cancelScheduledValues(time);
  this.amp.gain.setTargetAtTime(0.0001, time + 0.0002, releaseConstant);

  var interval = (time - this.audio.currentTime) + synth.releaseTime;
  window.setTimeout(this._disconnect.bind(this), interval * 1000);
};

////////////////
// EXCEPTIONS //
////////////////

/////////////
// EXPORTS //
/////////////

module.exports = Voice;
