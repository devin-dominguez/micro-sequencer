function Track(params) {
  params = params || {};
  this.type = params.type || "square";
  this.attackTime = params.attackTime || 0.05;
  this.decayTime = params.decayTime || 0.1;
  this.sustainLevel = params.sustainLevel || 0.5;
  this.releaseTime = params.releaseTime || 0.1;
  this.volume = params.volume || 0.15;
}

module.exports = Track;
