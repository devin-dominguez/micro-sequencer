var React = require('react');

var Modal = React.createClass({
  render: function() {
    return (
      <div className="modal">
        <div className="modal-content">
          {this.props.children}
        </div>
        <div className="modal-screen" />
      </div>
    );
  }

});

module.exports = Modal;
