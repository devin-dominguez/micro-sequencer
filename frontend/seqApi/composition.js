var Pattern = require('./pattern');
var Track = require('./track');

function Composition(params) {
  this.settings = params.settings;

  this.tracks = params.tracks.map(function(track) {
    return new Track(track);
  });

  this.sequence = params.sequence;

  this.patterns = {};
  Object.keys(params.patterns).forEach(function(patternId) {
    this.patterns[patternId] =  new Pattern(params.patterns[patternId]);
  }, this);
}

Composition.prototype.removeTrack = function(trackIdx) {
  this.tracks.splice(trackIdx, 1);
  Object.keys(this.patterns).forEach(function(patternId) {
    this.patterns[patternId].removeTrack(trackIdx);
  }, this);
};

Composition.prototype.addTrack = function() {
  this.tracks.push(new Track());
  Object.keys(this.patterns).forEach(function(patternId) {
    this.patterns[patternId].addTrack();
  }, this);
};


module.exports = Composition;
