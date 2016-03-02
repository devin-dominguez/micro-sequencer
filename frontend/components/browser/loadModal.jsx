var Modal = require('../util/modal');
var BrowseForm = require('./browseForm');

var React = require('react');

var LoadModal = React.createClass({

  render: function() {
    return (
      <Modal>
        <BrowseForm ownCompositions={true} />
      </Modal>
    );
  }

});

module.exports = LoadModal;
