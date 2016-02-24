var React = require('react');

var Header = require('./header/header');
var Footer = require('./footer');
var PianoRoll = require('./editor/pianoRoll');
var App = React.createClass({

  render: function() {
    return (
      <div className="app">
      <Header />
      {this.props.children}
      <div className="editor">
        <PianoRoll />
      </div>
      <Footer />
      </div>
    );
  }

});

module.exports = App;
