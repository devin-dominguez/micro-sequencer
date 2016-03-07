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
var SettingsModal = require('./components/editor/settingsModal');
var AboutModal = require('./components/aboutModal');

var SessionActions = require('./actions/sessionActions');
var CompositionActions = require('./actions/compositionActions');


var Playback = require('./seqApi/playback');

var routes = (
  <Route component={App} path="/">
    <Route component={SessionModal} path="login" />
    <Route component={BrowseModal} path="browse" />
    <Route component={LoadModal} path="load" />
    <Route component={SaveModal} path="save" />
    <Route component={SettingsModal} path="settings" />
    <Route component={AboutModal} path="about" />

  </Route>
);

  var playback = new Playback();
  SessionActions.recieveCurrentUser();
  CompositionActions.newComposition();
  History.replace("about");
  window.onbeforeunload = function() {
    return "Any unsaved changes will be lost";
  };

$(function() {
  var contentElement = $("#content")[0];

  ReactDOM.render(<Router history={History}>{routes}</Router>, contentElement);
});
