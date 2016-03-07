var Modal = require('../util/modal');
var SessionForm = require('./settingsForm');

var React = require('react');

var SettingsModal = React.createClass({

  render: function() {
    return (
      <Modal>
        <SessionForm/>
      </Modal>
    );
  }

});

module.exports = SettingsModal;
