var React = require('react');
var History = require('react-router').hashHistory;
var BrowserActions = require('../../actions/browserActions');

var CompositionListing = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    BrowserActions.selectComposition(this.props.composition.id);
  },

  onDoubleClick: function(e) {
    e.preventDefault();
    EditorActions.loadComposition(BrowserStore.selectedId());
    History.replace("");
  },

  render: function() {
  var selectClass = this.props.selected ? " selected" : "";

    return (
        <li>
          <ul className={"composition-listing" + selectClass}
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}
          >
          <li><h4>{this.props.composition.title}</h4></li>
          <li>{this.props.composition.composer}</li>
        </ul>
      </li>
    );
  }

});

module.exports = CompositionListing;
