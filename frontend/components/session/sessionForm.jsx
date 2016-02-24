var React = require('react');
var History = require('react-router').hashHistory;
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var SessionActions = require('../../actions/sessionActions');
var SessionStore = require('../../stores/sessionStore');

var SessionForm = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState: function() {

    return {
      sessionType: this.props.initialSessionType,
      username: '',
      password: '',
      errors: []
    };
  },

  componentWillMount: function() {
    this.listener = SessionStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    if (SessionStore.isLoggedIn()) {
      History.replace("");
    } else {
      this.setState({errors: SessionStore.errors()});
    }
  },

  cancelClick: function(e) {
    e.preventDefault();
    History.replace("");
  },

  onSubmit: function(e) {
    e.preventDefault();
    var user = {
      username: this.state.username,
      password: this.state.password
    };

    if (this.state.sessionType === "login") {
      SessionActions.newSession(user);
    } else {
      SessionActions.newUser(user);
    }
  },

  swapForm: function(e) {
    e.preventDefault();
    var sessionType = this.state.sessionType === "login" ? "signup" : "login";
    this.setState({
      sessionType: sessionType
    });
  },

  errors: function() {
    if (this.state.errors.length > 0) {
      var errorList = this.state.errors.map(function(error, idx) {
        return <li className='error' key={idx}>{error}</li>;
      });

      return (
        <ul className="error-list">{errorList}</ul>
      );
    }
  },

  render: function() {
    var titleText = this.state.sessionType === "login" ? "Log In" : "Sign Up";
    var swapText = this.state.sessionType === "login" ?
      "Need an account? ":
      "Already have an account? ";
    return (
      <div className="session-content">

        <h2 className="session-title">{titleText}</h2>

        <form onSubmit={this.onSubmit}>

          <label htmlFor="username">
            Username
            <input id="username" type="text" valueLink={this.linkState("username")}/>
          </label>

          <label htmlFor="password">
            Password
            <input id="password" type="password" valueLink={this.linkState("password")}/>
          </label>

          {this.errors()}

          <div className="session-buttons">
            <input className="button" type="submit" value={titleText}/>
            <button className="button" onClick={this.cancelClick}>Cancel</button>
          </div>

          <span className="swap-text">{swapText}
            <a href="#" onClick={this.swapForm}>Click Here</a>
          </span>

        </form>
      </div>
    );
  }

});

module.exports = SessionForm;

