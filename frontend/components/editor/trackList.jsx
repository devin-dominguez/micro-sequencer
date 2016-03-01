var React = require('react');
var EditorStore = require('../../stores/editorStore');
var TrackEditor = require('./trackEditor');

var TrackList = React.createClass({
  getInitialState: function() {
    return {
      tracks: EditorStore.tracks()
    };
  },

  componentWillMount: function() {
    this.listener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    this.setState({
      tracks: EditorStore.tracks()
    });
  },

  render: function() {
    var tracks = this.state.tracks.map(function(track, idx) {
      return (
          <TrackEditor
            key={idx}
            trackIdx={idx}
          />
          );
    });
    return (
      <div className="track-list">
        {tracks}
      </div>
    );
  }

});

module.exports = TrackList;
