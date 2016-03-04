var React = require('react');
var EditorStore = require('../../stores/editorStore');
var TrackListing = require('./trackListing');

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
          <TrackListing
            key={idx}
            trackIdx={idx}
          />
          );
    });
    return (
      <div className="track-list">
        <div className="track-list-header">
          <h2>Tracks</h2>
          <button className="button">+</button>
        </div>
        {tracks}
      </div>
    );
  }

});

module.exports = TrackList;
