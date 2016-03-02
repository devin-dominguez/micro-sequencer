var React = require('react');

var Header = require('./header/header');
var Footer = require('./footer');
var PianoRoll = require('./editor/pianoRoll');
var Transport = require('./transport');
var TrackList = require('./editor/trackList');
var TrackEditor = require('./editor/trackEditor');

var BrowseForm = require('./browser/browseForm');

var App = React.createClass({

  render: function() {
    return (
      <div className="app">
      <Header />
      {this.props.children}
      <div className="editor">

        <div className="settings panel">
          <Transport />
          <TrackList />
          <TrackEditor />
        </div>

        <PianoRoll />

      </div>

      <Footer />
      </div>
    );
  }

});

module.exports = App;
