var React = require('react');
var Modal = require('../util/modal');
var SaveForm = require('./saveForm');

var SaveModal = React.createClass({

  render: function() {
    return (
      <Modal>
        <SaveForm />
      </Modal>
    );
  }

});

module.exports = SaveModal;
