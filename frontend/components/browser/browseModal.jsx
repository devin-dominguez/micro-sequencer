var Modal = require('../util/modal');
var BrowseForm = require('./browseForm');

var React = require('react');

var BrowseModal = React.createClass({

  render: function() {
    return (
      <Modal>
        <BrowseForm ownCompositions={false} />
      </Modal>
    );
  }

});

module.exports = BrowseModal;
