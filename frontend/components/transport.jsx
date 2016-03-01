var React = require('react');
var PlaybackStore = require('../stores/playbackStore');
var PlaybackActions = require('../actions/playbackActions');
var EditorStore = require('../stores/editorStore');
var EditorActions = require('../actions/editorActions');

var Transport = React.createClass({
  getInitialState: function() {
    return {
      isPlaying: PlaybackStore.isPlaying(),
      tempo: EditorStore.tempo()
    };
  },

  componentWillMount: function() {
    this.playbackListener = PlaybackStore.addListener(this.onChange);
    this.editorListener = EditorStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.playbackListener.remove();
    this.editorListener.remove();
  },

  onChange: function() {
    this.setState({
      isPlaying: PlaybackStore.isPlaying(),
      tempo: EditorStore.tempo()
    });
  },

  onClickPlay: function() {
    if (this.state.isPlaying) {
      PlaybackActions.pause();
    } else {
      PlaybackActions.play();
    }
  },

  onClickStop: function() {
    PlaybackActions.stop();
  },

  onClickTempoDown: function(e) {
    e.preventDefault();
    EditorActions.setTempo(this.state.tempo - 1);
  },

  onClickTempoUp: function(e) {
    e.preventDefault();
    EditorActions.setTempo(this.state.tempo + 1);
  },

  render: function() {
    var buttonText = (this.state.isPlaying) ? "Pause" :  "Play";
    return (
      <div className="transport">
        <div className="playback-buttons">
          <button className="button"
            onClick={this.onClickPlay}
          >{buttonText}</button>

          <button className="button"
            onClick={this.onClickStop}
          >Stop</button>
        </div>

        <div className="tempo-control">

          <button className="button"
            onClick={this.onClickTempoDown}>-</button>

          <span className="tempo-number">{this.state.tempo}</span>

          <button className="button"
            onClick={this.onClickTempoUp}>+</button>

        </div>


      </div>
    );
  }

});

module.exports = Transport;
