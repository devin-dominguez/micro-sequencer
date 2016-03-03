var Modal = require('./modal');
var React = require('react');

var ConfirmationModal = React.createClass({

  render: function() {
    return (
      <Modal>
        <div className="confirmation-modal">

          <div className="confirmation-messages">
            <h3>{this.props.message}</h3>
            <h4>{this.props.submessage}</h4>
          </div>

          <div className="modal-buttons">
            <button className="button"
              onClick={this.props.yesCallback}
            >Yes</button>
            <button className="button"
              onClick={this.props.noCallback}
            >No</button>
          </div>

        </div>
      </ Modal>
    );
  }

});

module.exports = ConfirmationModal;
