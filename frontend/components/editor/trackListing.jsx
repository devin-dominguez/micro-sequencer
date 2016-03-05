var React = require('react');
var EditorStore = require('../../stores/editorStore');
var EditorActions = require('../../actions/editorActions');
var ConfirmationModal = require('../util/confirmationModal');

var TrackListing = React.createClass({
  getInitialState: function() {
    var isCurrentTrack = this.props.trackIdx === EditorStore.currentTrackIdx();
    var track = EditorStore.track(this.props.trackIdx);
    return {
      isCurrentTrack: isCurrentTrack,
      muted: track.muted,
      volume: track.volume,
      isConfirming: false
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
      if (track) {
      this.setState({
        isCurrentTrack: isCurrentTrack,
        muted: track.muted,
        volume: track.volume
      });
    }
  },

  synthParamChange: function(type, e) {
    e.preventDefault();
    var newState = {};
    newState[type] = e.target.value;
    EditorActions.updateSynth(this.props.trackIdx, newState);
  },

  onClick: function(e) {
    e.preventDefault();
    EditorActions.selectTrack(this.props.trackIdx);
  },

  onClickRemoveTrack: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isConfirming: true
    });
  },

  confirmRemoveTrack: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (EditorStore.composition().tracks.length === 1) {
      EditorActions.addTrack();
    }
    EditorActions.removeTrack(this.props.trackIdx);
    this.setState({
      isConfirming: false
    });
  },

  cancelRemoveTrack: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isConfirming: false
    });
  },

  preventDefault: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },

  render: function() {
    var className = this.state.isCurrentTrack ? "current-track" : "";
    var confirmationModal = this.state.isConfirming ?
          (<ConfirmationModal
            message={"Are you sure you wish to remove Track " +
                (this.props.trackIdx + 1) + "?"}
            submessage="This will be permanent."
            yesCallback={this.confirmRemoveTrack}
            noCallback={this.cancelRemoveTrack}
          />) :
            null;

    return (
      <div className={"track-listing " + className}
        onClick={this.onClick}
      >
        <div className="track-header">
          <h4>{"Track " + (this.props.trackIdx + 1)}</h4>
          <div className="button"
            onClick={this.onClickRemoveTrack}
          >x</div>
        </div>

        <div className="track-listing-controls">

          <input id="volume"
            type="range"
            step="0.0001"
            min="0"
            max="0.25"
            value={this.state.volume}
            onChange={this.synthParamChange.bind(this, "volume")}
            onClick={this.preventDefault}
          />
        </div>
        {confirmationModal}

      </div>
    );
  }

});

module.exports = TrackListing;
