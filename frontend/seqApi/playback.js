var audio = new window.AudioContext();

var _lookAhead = 0.1;
var _interval = 0.5;

function Playback() {
  this.playbackQueue = {};
  this.tickDuration = 0.1;
  this.currentTick = 0;

  this.nextNoteTime = 0;
  this.isPlaying = false;

  this.phraseLength = 128;
}

Playback.prototype._incrementTick = function() {
  this.nextNoteTime += this.tickDuration;
  this.currentTick = (this.currentTick + 1) % this.phraseLength;
};

function _scheduler() {
  while (this.nextNoteTime < audio.currentTime + _lookAhead) {

    if (this.playbackQueue[this.currentTick]) {

      while (this.playbackQueue[this.currentTick].length) {
        var note = this.playbackQueue[this.currentTick].shift();
        this.currentSynthRunner.scheduleNote(note.pitch,
            note.duration * this.tickDuration,
            this.nextNoteTime);
      }
    }
    this.incrementTick();
  }
}

Playback.prototype.play = function() {
  this.nextNoteTime = audio.currentTime;
  this.isPlaying = true;
  this.buildPlaybackQueue();
  this.intervalId = window.setInterval(this._scheduler.bind(this), _interval);
};

Playback.prototype.stop = function() {
  this.isPlaying = false;
  window.clearInterval(this.intervalId);
};

Playback.prototype.buildPlaybackQueue = function() {
  this.playbackQueue = {};
  this.phrase.notes.forEach(function(note) {
    if (!this.playbackQueue[note.position]) {
      this.playbackQueue[note.position] = [note];
    } else {
      this.playbackQueue.push(note);
    }
  });
};


module.exports = Playback;
