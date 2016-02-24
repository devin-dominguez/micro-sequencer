window.SessionStore = require('./stores/sessionStore');
var SessionActions = require('./actions/sessionActions');
window.SessionActions = SessionActions;

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var App = require('./components/app');
var SessionModal = require('./components/session/sessionModal');

var routes = (
  <Route component={App} path="/">
    <Route component={SessionModal} path="login" />
  </Route>
);


$(function() {
  SessionActions.recieveCurrentUser();
  var contentElement = $("#content")[0];

  ReactDOM.render(<Router>{routes}</Router>, contentElement);
});
