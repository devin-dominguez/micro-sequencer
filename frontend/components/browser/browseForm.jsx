var React = require('react');
var History = require('react-router').hashHistory;
var Modal = require('../util/modal');
var BrowserStore = require('../../stores/browserStore');
var BrowserActions = require('../../actions/browserActions');
var EditorActions = require('../../actions/editorActions');
var CompositionList = require('./compositionList');

var BrowseForm = React.createClass({

  getInitialState: function() {
    return {
      compositions: [],
      searchString: ""
    };
  },

  onChange: function() {
    this.setState({
      compositions: BrowserStore.allCompositions(),
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
    EditorActions.loadComposition(BrowserStore.selectedId());
    History.replace("");
  },

  render: function() {
    var titleText = this.props.ownCompositions ? "Load" : "Browse";
    var loadButtonClass = BrowserStore.selectedId() === -1 ? " disabled" : "";

    return (
        <div className="browse-form">
          <h2>{titleText}</h2>
          <input type="text" placeholder="Search"
            value={this.state.searchString}
            onChange={this.onChangeSearch}
          />
          <CompositionList compositions={this.state.compositions} />

          <div className="browse-buttons">
            <button className={"button" + loadButtonClass}
              onClick={this.loadClick}
            >Load</button>
            <button className="button" onClick={this.cancelClick}>Cancel</button>
          </div>
        </div>
    );
  }

});

module.exports = BrowseForm;
