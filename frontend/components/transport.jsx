var React = require('react');
var PlaybackStore = require('../stores/playbackStore');
var PlaybackActions = require('../actions/playbackActions');

var Transport = React.createClass({
  getInitialState: function() {
    return {
      isPlaying: false,
      tempo: 120
    };
  },

  componentWillMount: function() {
    this.listener = PlaybackStore.addListener(this.onChange);
  },

  componentWillUnmount: function() {
    this.listener.remove();;
  },

  onChange: function() {
    this.setState({
      isPlaying: PlaybackStore.isPlaying()
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
    this.setState({
      tempo: this.state.tempo - 1
    });

    EditorActions.setTempo(this.state.tempo);
  },

  onClickTempoUp: function(e) {
    e.preventDefault();
    this.setState({
      tempo: this.state.tempo + 1
    });

    EditorActions.setTempo(this.state.tempo);
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
