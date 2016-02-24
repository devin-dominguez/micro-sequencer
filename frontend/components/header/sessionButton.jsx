var React = require('react');

var History = require('react-router').hashHistory;
var SessionStore = require('../../stores/sessionStore');
var SessionActions = require('../../actions/sessionActions');

var SessionButton = React.createClass({
  logout: function() {
    console.log("button");
    SessionActions.logout();
  },

  login: function() {
    History.replace("login");
  },

  render: function() {
    var buttonText = this.props.loggedIn ? "Log Out" : "Account";
    var clickAction = this.props.loggedIn ? this.logout : this.login;
    return (
      <button className="button" onClick={clickAction}>{buttonText}</button>
    );
  }

});

module.exports = SessionButton;
