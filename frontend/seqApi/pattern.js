var Phrase = require('./phrase');

function Pattern(params) {
  this.length = params.length;
  this.phrases = params.phrases.map(function(phrase) {
    return new Phrase(phrase);
  });
}

Pattern.prototype._removeTrack = function(trackIdx) {
  this.phrases.splice(trackIdx, 1);
};

Pattern.prototype._addTrack = function() {
  this.phrases.push(new Phrase({length: this.length}));
};

module.exports = Pattern;
