window.SessionStore = require('./stores/sessionStore');
window.SessionActions = require('./actions/sessionActions');

var React = require('react');
var ReactDOM = require('react-dom');


$(function() {
  var contentElement = $("content")[0];

  ReactDOM.render(<h1>Yo</h1>, contentElement);
});
