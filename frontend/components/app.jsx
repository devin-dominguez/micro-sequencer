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

        <div>
          <Transport/>
        </div>

        <div>
          <PianoRoll />
        </div>

        <div>
          <SynthEditor />
        </div>

      </div>

      <Footer />
      </div>
    );
  }

});

module.exports = App;
