var React = require('react');
var EditorStore = require('../../stores/editorStore');
var EditorActions = require('../../actions/editorActions');

var TrackEditor = React.createClass({

  getInitialState: function() {
    var track = EditorStore.currentTrack();
    return {
      trackIdx: EditorStore.currentTrackIdx(),
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
    var track = EditorStore.currentTrack();
    this.setState({
      trackIdx: EditorStore.currentTrackIdx(),
      attackTime: track.attackTime,
      decayTime: track.decayTime,
      sustainLevel: track.sustainLevel,
      releaseTime: track.releaseTime,
      type: track.type
    });
  },

  synthParamChange: function(type, e) {
    e.preventDefault();
    var newState = {};
    newState[type] = e.target.value;
    EditorActions.updateSynth(this.state.trackIdx, newState);
  },

  render: function() {
    return (
      <div className="track-editor ">
        <h2>Sound Design</h2>
        <div className="track-controls">
          <label>
            Waveform
            <select id="waveform"
              value={this.state.type}
              onChange={this.synthParamChange.bind(this, "type")}
            >
              <option value="sawtooth">Saw</option>

              <option value="square">Square</option>

              <option value="triangle">Triangle</option>

              <option value="sine">Sine</option>
            </select>
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
