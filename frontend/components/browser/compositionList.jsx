var React = require('react');
var CompositionListing = require('./compositionListing');
var BrowserStore = require('../../stores/browserStore');

var CompositionList = React.createClass({

  render: function() {
    var compositions = this.props.compositions.map(function(composition, idx) {
      return (
          <CompositionListing
            key={idx}
            composition={composition}
            selected={composition.id === BrowserStore.selectedId()}
          />
          );
    });
    return (
      <div className="composition-list">
        <ul className="composition-list-body">
          {compositions}
        </ul>
      </div>
    );
  }

});

module.exports = CompositionList;
