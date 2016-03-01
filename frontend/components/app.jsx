var React = require('react');

var Header = require('./header/header');
var Footer = require('./footer');
var PianoRoll = require('./editor/pianoRoll');
var Transport = require('./transport');
var SynthEditor = require('./editor/synthEditor');
var App = React.createClass({

  render: function() {
    return (
      <div className="app">
      <Header />
      {this.props.children}
      <div className="editor">

        <div className="settings-panel">
          <Transport/>
          <SynthEditor />
        </div>

        <div>
          <PianoRoll />
        </div>

      </div>

      <Footer />
      </div>
    );
  }

});

module.exports = App;
