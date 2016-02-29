//////////////
// CREATION //
//////////////

var smoothTime = 0.01;


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
  this.osc.start(0);

  this.amp = this.audio.createGain();
  this.amp.gain.value = 0;

  this.osc.connect(this.amp);
  this.amp.connect(this.track);
};

Voice.prototype._disconnect = function() {
  this.osc.stop(0);
  this.osc.disconnect();
  this.amp.disconnect();
};

Voice.prototype._noteOn = function(synth, freq, time) {
  this.osc.type = synth.type;

  time = time || this.audio.currentTime;

  this.osc.frequency.setValueAtTime(freq, time);

  this.amp.gain.cancelScheduledValues(time);

  this.amp.gain.linearRampToValueAtTime(0, time + smoothTime);

  this.amp.gain.linearRampToValueAtTime(1,
      time + smoothTime + synth.attackTime);

  this.amp.gain.exponentialRampToValueAtTime(
      synth.sustainLevel,
      time + smoothTime + synth.attackTime + synth.decayTime);

  this.amp.gain.setValueAtTime(synth.sustainLevel,
      time + smoothTime + synth.attackTime + synth.decayTime + 0.0001);
};

Voice.prototype._noteOff = function(synth, time) {
  time = time || this.audio.currentTime;
  var endTime = time + synth.releaseTime;
  var interval = (endTime - this.audio.currentTime) * 1000;

  this.amp.gain.linearRampToValueAtTime(0, endTime);
  window.setTimeout(this._disconnect.bind(this), interval);
};

////////////////
// EXCEPTIONS //
////////////////

/////////////
// EXPORTS //
/////////////

module.exports = Voice;
