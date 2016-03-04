var Phrase = require('./phrase');

function Pattern(params) {
  this.length = params.length;
  this.phrases = params.phrases.map(function(phrase) {
    return new Phrase(phrase);
  });
}

Pattern.prototype.removeTrack = function(trackIdx) {
  this.phrases.splice(trackIdx, 1);
};

Pattern.prototype.addTrack = function() {
  this.phrases.push(new Phrase({length: this.length}));
};

Pattern.prototype.resize = function(newSize) {
  this.length = newSize;
  this.phrases.forEach(function(phrase) {
    phrase.resize(newSize);
  });
};

module.exports = Pattern;
