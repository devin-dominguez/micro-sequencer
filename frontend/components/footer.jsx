var React = require('react');
var SessionStore = require('../stores/sessionStore');

var Footer = React.createClass({
  getInitialState: function() {
    return {
      loggedInMessage: "Not Logged In"
    };
  },

  onChange: function() {
    var loggedInMessage;
    if (SessionStore.isLoggedIn()) {
      loggedInMessage = "Logged In As " + SessionStore.currentUser().username;
    } else {
      loggedInMessage = "Not Logged In";
    }
    this.setState({
      loggedInMessage: loggedInMessage
    });
  },

  componentWillMount: function() {
    this.listener = SessionStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  render: function() {
    return (
      <footer className="footer">
        <div className="copyright-info">
          &copy; Devin Dominguez 2016<br/>
          <a href="http://www.dominguezaudio.com" target="_blank">
            www.dominguezaudio.com
          </a>
        </div>
        {this.state.loggedInMessage}
      </footer>
    );
  }

});

module.exports = Footer;
