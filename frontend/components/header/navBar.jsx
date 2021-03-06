var React = require('react');
var History = require('react-router').hashHistory;
var SessionButton = require('./sessionButton');
var SessionStore = require('../../stores/sessionStore');
var ConfirmationModal = require('../util/confirmationModal');
var CompositionActions = require('../../actions/compositionActions');

var Tour = require('../../tour');

var NavBar = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: SessionStore.isLoggedIn(),
      isConfirming: false
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

  onSaveClick: function(e) {
    e.preventDefault();
    History.replace("save");
  },

  onSettingsClick: function(e) {
    e.preventDefault();
    History.replace("settings");
  },

  onNewClick: function(e) {
    e.preventDefault();
    this.setState({
      isConfirming: true
    });
  },

  confirmNew: function (e) {
    e.preventDefault();
    this.setState({
      isConfirming: false
    });
    CompositionActions.newComposition();
  },

  cancelNew: function(e) {
    e.preventDefault();
    this.setState({
      isConfirming: false
    });
  },

  onAboutClick: function(e) {
    e.preventDefault();
    History.replace("about");
  },

  render: function() {
    var saveButton = this.state.loggedIn ?
      <li><button className="button"
        onClick={this.onSaveClick}
      >Save</button></li> :
      "";

    var loadButton = this.state.loggedIn ?
      <li><button className="button"
        onClick={this.onLoadClick}
      >Load</button></li> :
      "";

    var confirmationModal = this.state.isConfirming ?
          (<ConfirmationModal
            message="Are you sure?"
            submessage="Any unsaved changes will be lost."
            yesCallback={this.confirmNew}
            noCallback={this.cancelNew}
          />) :
            null;
    return (
      <nav className='nav-bar'>
        <ul>
          <li><button className="button"
            onClick={this.onNewClick}
          >New</button></li>
          {saveButton}
          {loadButton}
          <li><button className="button browse-button"
            onClick={this.onBrowseClick}
          >Browse</button></li>
          <li><button className="button"
            onClick={this.onSettingsClick}
          >Settings</button></li>
          <li><button className="button about-button"
            onClick={this.onAboutClick}
          >About</button></li>
          <li><SessionButton loggedIn={this.state.loggedIn}/></li>
          <li><button className="button tour-button"
            onClick={Tour.start.bind(Tour)}
          >Tour</button></li>
        </ul>
        {confirmationModal}
      </nav>
    );
  }
});

module.exports = NavBar;
