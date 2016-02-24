var Modal = require('../util/modal');
var SessionForm = require('./sessionForm');

var React = require('react');

var SessionModal = React.createClass({
  componentWillMount: function() {
    this.sessionType = this.props.route.path;
  },

  render: function() {
    return (
      <Modal>
        <SessionForm initialSessionType={this.sessionType}/>
      </Modal>
    );
  }

});

module.exports = SessionModal;
