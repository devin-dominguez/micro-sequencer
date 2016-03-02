var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var History = require('react-router').hashHistory;

var App = require('./components/app');
var SessionModal = require('./components/session/sessionModal');
var BrowseModal = require('./components/browser/browseModal');
var LoadModal = require('./components/browser/loadModal');

var SessionActions = require('./actions/sessionActions');
var EditorActions = require('./actions/editorActions');
var PlaybackActions = require('./actions/playbackActions');
var BrowserActions = require('./actions/browserActions');

var routes = (
  <Route component={App} path="/">
    <Route component={SessionModal} path="login" />
    <Route component={BrowseModal} path="browse" />
    <Route component={LoadModal} path="load" />
  </Route>
);

$(function() {
  SessionActions.recieveCurrentUser();
  var contentElement = $("#content")[0];

  ReactDOM.render(<Router history={History}>{routes}</Router>, contentElement);
});


window.EditorStore = require('./stores/editorStore');
window.EditorActions = EditorActions;

window.PlaybackStore = require('./stores/playbackStore');
window.PlaybackActions = PlaybackActions;

window.BrowserStore = require('./stores/browserStore');
window.BrowserActions = BrowserActions;
