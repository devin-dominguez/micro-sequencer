var React = require('react');

var History = require('react-router').hashHistory;
var SessionStore = require('../../stores/sessionStore');
var SessionActions = require('../../actions/sessionActions');
var BrowserActions = require('../../actions/browserActions');
var ConfirmationModal = require('../util/confirmationModal');

var SessionButton = React.createClass({
  getInitialState: function() {
    return {
      isConfirming: false
    };
  },

  logout: function() {
    this.setState({
      isConfirming: true
    });
  },

  login: function() {
    History.replace("login");
  },

  confirmLogout: function() {
    SessionActions.logout();
    BrowserActions.clearOwnCompositions();
    this.setState({
      isConfirming: false
    });
  },

  cancelLogout: function() {
    this.setState({
      isConfirming: false
    });
  },

  render: function() {
    var buttonText = this.props.loggedIn ? "Log Out" : "Account";
    var clickAction = this.props.loggedIn ? this.logout : this.login;

    var confirmationModal = this.state.isConfirming ?
          (<ConfirmationModal
            message="Are you sure you wish to logout?"
            submessage="You will not be able to save your work."
            yesCallback={this.confirmLogout}
            noCallback={this.cancelLogout}
          />) :
            null;
    return (
      <div>
        <button className="button" onClick={clickAction}>{buttonText}</button>
        {confirmationModal}
      </div>
    );
  }

});

module.exports = SessionButton;
