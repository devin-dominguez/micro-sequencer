var Config = require('./config.js');
var Util = require('./util.js');

//////////////
// CREATION //
//////////////

function Note(options) {
  this.pitch = this._checkPitch(options.pitch);
  this.position = options.position;
  this.duration = this._checkDuration(options.duration);
}

///////////////
// INTERFACE //
///////////////

/////////////
// METHODS //
/////////////

Note.prototype._isOverlapping = function(otherNote) {
  if (this.pitch === otherNote.pitch) {
    return this.position <= otherNote._end() &&
      otherNote.position <= this._end();
  } else {
    return false;
  }
};

Note.prototype._end = function() {
  return this.position + this.duration - 1;
};

Note.prototype._eq = function(otherNote) {
  return (
    this.pitch === otherNote.pitch &&
    this.position === otherNote.position &&
    this.duration === otherNote.duration
  );
};

Note.prototype._checkDuration = function(duration) {
  if (duration >= 1) {
    return 0 | duration;
  } else {
    throw new DurationException(duration);
  }
};

Note.prototype._checkPitch = function(pitch) {
  if (Util.isBetween(pitch, Config.MIN_PITCH, Config.MAX_PITCH)) {
    return 0 | pitch;
  } else {
    throw new PitchOutOfRangeException(pitch);
  }
};

////////////////
// EXCEPTIONS //
////////////////

function DurationException(duration) {
  this.name = "DurationException";
  this.duration = duration;
}

function PitchOutOfRangeException(pitch) {
  this.name = "PitchOutOfRangeException";
  this.pitch = pitch;
  this.minPitch = Config.MIN_PITCH;
  this.maxPitch = Config.MAX_PITCH;
}

/////////////
// EXPORTS //
/////////////

module.exports = Note;

