var React = require('react');
var EditorStore = require('../stores/editorStore');

var Header = require('./header/header');
var Footer = require('./footer');
var PianoRoll = require('./editor/pianoRoll');
var Transport = require('./transport');
var TrackList = require('./editor/trackList');
var TrackEditor = require('./editor/trackEditor');

var BrowseForm = require('./browser/browseForm');

var App = React.createClass({

  getInitialState: function() {
    return {
      title: EditorStore.title()
    };
  },

  componentDidMount: function() {
    this.editorListener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.editorListener.remove();
  },

  onChange: function() {
    this.setState({
      title: EditorStore.title()
    });
  },

  render: function() {
    return (
      <div className="app">
      <Header />
      {this.props.children}
      <div className="editor">

        <div className="settings panel">
          <h3 className="composition-title">{this.state.title}</h3>
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
