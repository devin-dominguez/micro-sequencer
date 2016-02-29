//////////////
// CREATION //
//////////////

function Voice(track, audio) {
  this.track = track;
  this.audio = audio;

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
  this.osc.stop(0);
  this.osc.disconnect();
  this.amp.disconnect();
};

Voice.prototype._noteOn = function(synth, freq, time) {
  this.amp.gain.setValueAtTime(0, time);
  this.osc.type = synth.type;
  this.osc.start(time);

  this.osc.frequency.setValueAtTime(freq, time);

  var attackConstant = (synth.attackTime * 2) / 10;
  this.amp.gain.setTargetAtTime(1, time, attackConstant);

  var decayConstant = (synth.decayTime * 2) / 10;
  this.amp.gain.setTargetAtTime(synth.sustainLevel, time + synth.attackTime, decayConstant);

  this.finishTime = time + synth.attackTime + synth.decayTime;
};

Voice.prototype._noteOff = function(synth, time) {
  time = Math.max(time, this.finishTime);
  var releaseConstant = (synth.releaseTime * 2) / 10;

  this.amp.gain.cancelScheduledValues(time + .0001);
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
