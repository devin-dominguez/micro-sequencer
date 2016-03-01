var React = require('react');
var EditorStore = require('../../stores/editorStore');
var LinkedStateMixin = require('react-addons-linked-state-mixin');

var TrackEditor = React.createClass({

  getInitialState: function() {
    var isCurrentTrack = this.props.trackIdx === EditorStore.currentTrackIdx();
    var track = EditorStore.track(this.props.trackIdx);
    return {
      isCurrentTrack: isCurrentTrack,
      volume: track.volume,
      attackTime: track.attackTime,
      decayTime: track.decayTime,
      sustainLevel: track.sustainLevel,
      releaseTime: track.releaseTime,
      type: track.type
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
    this.setState({
      isCurrentTrack: isCurrentTrack,
    });
  },

  synthParamChange: function(type, e) {
    e.preventDefault();
    newState = {};
    newState[type] = e.target.value;
    this.setState(newState);
    EditorActions.updateSynth(this.props.trackIdx, newState);
  },

  render: function() {
    var className = this.state.isCurrentTrack ? "current-track" : "";

    return (
      <div className={"track-editor " + className}>
        <div className="track-details">
          <h2>{"Track " + (this.props.trackIdx + 1)}</h2>
        </div>
        <div className="track-controls">
          <label>
            Volume
            <input id="volume"
              type="range"
              step="0.0001"
              min="0"
              max="0.25"
              value={this.state.volume}
              onChange={this.synthParamChange.bind(this, "volume")}
            />
          </label>

          <label>
            Attack
            <input id="attack-time"
              type="range"
              step="0.0001"
              min="0.01"
              max="1"
              value={this.state.attackTime}
              onChange={this.synthParamChange.bind(this, "attackTime")}
            />
          </label>

          <label>
            Decay
            <input id="decay-time"
              type="range"
              step="0.0001"
              min="0.01"
              max="0.75"
              value={this.state.decayTime}
              onChange={this.synthParamChange.bind(this, "decayTime")}
            />
          </label>

          <label>
            Sustain
            <input id="sustain-level"
              type="range"
              step="0.0001"
              min="0"
              max="1"
              value={this.state.sustainLevel}
              onChange={this.synthParamChange.bind(this, "sustainLevel")}
            />
          </label>

          <label>
            Release
            <input id="release-time"
              type="range"
              step="0.0001"
              min="0.01"
              max="1"
              value={this.state.releaseTime}
              onChange={this.synthParamChange.bind(this, "releaseTime")}
            />
          </label>
        </div>
      </div>
    );
  }

});

module.exports = TrackEditor;
