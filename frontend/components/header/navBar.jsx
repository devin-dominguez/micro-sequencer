var React = require('react');
var History = require('react-router').hashHistory;
var SessionButton = require('./sessionButton');
var SessionStore = require('../../stores/sessionStore');

var NavBar = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: SessionStore.isLoggedIn()
    };
  },

  componentDidMount: function() {
    this.listener = SessionStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    this.setState({
      loggedIn: SessionStore.isLoggedIn()
    });
  },

  onBrowseClick: function(e) {
    e.preventDefault();
    History.replace("browse");
  },

  onLoadClick: function(e) {
    e.preventDefault();
    History.replace("load");
  },

  render: function() {
    var saveButton = this.state.loggedIn ?
      <li><button className="button">Save</button></li> :
      "";
    var loadButton = this.state.loggedIn ?
      <li><button className="button"
        onClick={this.onLoadClick}
      >Load</button></li> :
      "";
    return (
      <nav className='nav-bar'>
        <ul>
          {saveButton}
          {loadButton}
          <li><button className="button"
            onClick={this.onBrowseClick}
          >Browse</button></li>
          <li><button className="button">Settings</button></li>
          <li><SessionButton loggedIn={this.state.loggedIn}/></li>
        </ul>
      </nav>
    );
  }
});

module.exports = NavBar;
