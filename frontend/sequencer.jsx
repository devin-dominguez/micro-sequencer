var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var History = require('react-router').hashHistory;

var App = require('./components/app');
var SessionModal = require('./components/session/sessionModal');

var SessionActions = require('./actions/sessionActions');
var EditorActions = require('./actions/editorActions');

var routes = (
  <Route component={App} path="/">
    <Route component={SessionModal} path="login" />
  </Route>
);

$(function() {
  SessionActions.recieveCurrentUser();
  var contentElement = $("#content")[0];

  ReactDOM.render(<Router history={History}>{routes}</Router>, contentElement);
});


window.EditorStore = require('./stores/editorStore');
window.EditorActions = EditorActions;
window.Voice = require('./seqApi/voice');

window.SynthRunner = require('./seqApi/synthRunner');

window.audio = new AudioContext();
window.track1 = window.audio.createGain();
window.track1.gain.value = 0.25;
window.track1.connect(window.audio.destination);

window.synth = {
  type: "square",
  attackTime: .01,
  decayTime: .1,
  sustainLevel: .25,
  releaseTime: 0.25,

};

window.synthRunner = new window.SynthRunner(
    window.synth,
    window.track1,
    window.audio);

window.play = function(tickLength) {
  window.EditorStore.phrase().notes.forEach(function(note) {
    window.synthRunner.scheduleNote(
        note.pitch,
        note.duration * tickLength,
        note.position * tickLength + window.audio.currentTime);
  });
};
