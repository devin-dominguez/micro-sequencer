var Config = require('./config.js');

//////////////
// CREATION //
//////////////

function Note(options) {
  this.pitch = this.checkPitch(options.pitch);
  this.position = options.position;
  this.duration = this.checkDuration(options.duration);
}

///////////////
// INTERFACE //
///////////////

/////////////
// METHODS //
/////////////

Note.prototype.isOverlapping = function(otherNote) {
  if (this.pitch === otherNote.pitch) {
    return this.position <= otherNote.end() &&
      otherNote.position <= this.end();
  } else {
    return false;
  }
};

Note.prototype.end = function() {
  return this.position + this.duration - 1;
};

Note.prototype.eq = function(otherNote) {
  return (
    this.pitch === otherNote.pitch &&
    this.position === otherNote.position &&
    this.duration === otherNote.duration
  );
};

Note.prototype.checkDuration = function(duration) {
  if (duration >= 1) {
    return 0 | duration;
  } else {
    throw new DurationException(duration);
  }
};

Note.prototype.checkPitch = function(pitch) {
  if ( pitch >= Config.MIN_PITCH && pitch <= Config.MAX_PITCH) {
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

