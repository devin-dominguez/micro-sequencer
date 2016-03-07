var React = require('react');
var NavBar = require('./navBar');

var Header = React.createClass({

  render: function() {
    return (
      <header className="header">
        <h1 className="logo">&#xb5;-seq</h1>
        <NavBar />
      </header>
    );
  }

});

module.exports = Header;
