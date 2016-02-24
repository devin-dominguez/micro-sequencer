var React = require('react');

var Header = require('./header/header');
var Footer = require('./footer');
var App = React.createClass({

  render: function() {
    return (
      <div className="app">
      <Header />
      {this.props.children}
      <div className="editor"></div>
      <Footer />
      </div>
    );
  }

});

module.exports = App;
