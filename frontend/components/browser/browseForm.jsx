var React = require('react');
var History = require('react-router').hashHistory;
var ConfirmationModal = require('../util/confirmationModal');
var BrowserStore = require('../../stores/browserStore');
var BrowserActions = require('../../actions/browserActions');
var CompositionActions = require('../../actions/compositionActions');
var CompositionList = require('./compositionList');

var BrowseForm = React.createClass({

  getInitialState: function() {
    return {
      compositions: [],
      searchString: "",
      isConfirming: false
    };
  },

  onChange: function() {
    var compositions = this.props.ownCompositions ?
      BrowserStore.ownCompositions() :
      BrowserStore.allCompositions();
    this.setState({
      compositions: compositions,
      searchString: BrowserStore.searchString()
    });
  },

  onChangeSearch: function(e) {
    e.preventDefault();
    BrowserActions.updateSearchString(e.target.value);
  },

  componentWillMount: function() {
    this.listener = BrowserStore.addListener(this.onChange);
    BrowserActions.receiveCompositions(this.props.ownCompositions);
  },

  componentWillUnmount: function() {
    this.listener.remove();
    BrowserActions.updateSearchString("");
    BrowserActions.selectComposition(-1);
  },

  cancelClick: function(e) {
    e.preventDefault();
    History.replace("");
  },

  loadClick: function(e) {
    e.preventDefault();
    if (BrowserStore.selectedId() !== -1) {
      this.setState({
        isConfirming: true
      });
    }
  },

  confirmLoad: function(e) {
    e.preventDefault();
    CompositionActions.loadComposition(BrowserStore.selectedId());
    History.replace("");
  },

  cancelLoad: function(e) {
    e.preventDefault();
    this.setState({
      isConfirming: false
    });
  },

  render: function() {
    var titleText = this.props.ownCompositions ? "Load" : "Browse";
    var loadButtonClass = BrowserStore.selectedId() === -1 ? " disabled" : "";
    var confirmationModal = this.state.isConfirming ?
          (<ConfirmationModal
            message="Are you sure you want to load?"
            submessage="Any unsaved changes will be lost."
            yesCallback={this.confirmLoad}
            noCallback={this.cancelLoad}
          />) :
            null;

    return (
        <div className="browse-form">
          <h2>{titleText}</h2>
          <input type="text" placeholder="Search"
            value={this.state.searchString}
            onChange={this.onChangeSearch}
          />
          <CompositionList compositions={this.state.compositions} />

          <div className="modal-buttons">
            <button className={"button" + loadButtonClass}
              onClick={this.loadClick}
            >Load</button>
            <button className="button" onClick={this.cancelClick}>Cancel</button>
          </div>

          {confirmationModal}
        </div>
    );
  }

});

module.exports = BrowseForm;
