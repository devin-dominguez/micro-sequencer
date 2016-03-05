var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var History = require('react-router').hashHistory;

var App = require('./components/app');
var SessionModal = require('./components/session/sessionModal');
var BrowseModal = require('./components/browser/browseModal');
var LoadModal = require('./components/browser/loadModal');
var SaveModal = require('./components/browser/saveModal');

var SessionActions = require('./actions/sessionActions');
var EditorActions = require('./actions/editorActions');
var PlaybackActions = require('./actions/playbackActions');
var BrowserActions = require('./actions/browserActions');
var CompositionActions = require('./actions/compositionActions');


var Playback = require('./seqApi/playback');

var routes = (
  <Route component={App} path="/">
    <Route component={SessionModal} path="login" />
    <Route component={BrowseModal} path="browse" />
    <Route component={LoadModal} path="load" />
    <Route component={SaveModal} path="save" />
  </Route>
);

  var playback = new Playback();
  SessionActions.recieveCurrentUser();
  CompositionActions.newComposition();

$(function() {
  var contentElement = $("#content")[0];

  ReactDOM.render(<Router history={History}>{routes}</Router>, contentElement);
});

window.SessionStore = require('./stores/sessionStore');

window.EditorStore = require('./stores/editorStore');
window.EditorActions = EditorActions;

window.PlaybackStore = require('./stores/playbackStore');
window.PlaybackActions = PlaybackActions;

window.BrowserStore = require('./stores/browserStore');
window.BrowserActions = BrowserActions;
