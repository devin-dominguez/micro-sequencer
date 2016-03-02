var React = require('react');
var EditorStore = require('../../stores/editorStore');
var EditorActions = require('../../actions/editorActions');

var TrackListing = React.createClass({
  getInitialState: function() {
    var isCurrentTrack = this.props.trackIdx === EditorStore.currentTrackIdx();
    var track = EditorStore.track(this.props.trackIdx);
    return {
      isCurrentTrack: isCurrentTrack,
      muted: track.muted,
      volume: track.volume
    };
  },

  componentWillMount: function() {
    this.listener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  onChange: function() {
    var isCurrentTrack = this.props.trackIdx === EditorStore.currentTrackIdx();
    var track = EditorStore.track(this.props.trackIdx);
    this.setState({
      isCurrentTrack: isCurrentTrack,
      muted: track.muted,
      volume: track.volume
    });
  },

  synthParamChange: function(type, e) {
    e.preventDefault();
    var newState = {};
    newState[type] = e.target.value;
    EditorActions.updateSynth(this.props.trackIdx, newState);
  },

  onDoubleClick: function(e) {
    e.preventDefault();
    EditorActions.selectTrack(this.props.trackIdx);
  },

  render: function() {
    var className = this.state.isCurrentTrack ? "current-track" : "";

    return (
      <div className={"track-listing " + className}
        onDoubleClick={this.onDoubleClick}
      >
        <div className="track-name">
          <h4>{"Track " + (this.props.trackIdx + 1)}</h4>
        </div>

        <div className="track-listing-controls">
          <input className="toggle" type="checkbox"
            value="mute"
            checked={!this.state.muted}
            onChange={this.synthParamChange.bind(this, "muted")}
          />

          <input id="volume"
            type="range"
            step="0.0001"
            min="0"
            max="0.25"
            value={this.state.volume}
            onChange={this.synthParamChange.bind(this, "volume")}
          />
        </div>

      </div>
    );
  }

});

module.exports = TrackListing;
