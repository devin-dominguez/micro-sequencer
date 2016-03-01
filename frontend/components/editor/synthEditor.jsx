var React = require('react');

var SynthEditor = React.createClass({

  render: function() {
    return (
      <div className="synth-editor">
      <div className="envelope">
          <label>
            Attack
            <input id="attack-time"
              orient="vertical"
              type="range"
            />
          </label>

          <label>
            Decay
            <input id="decay-time"
              type="range"
              orient="vertical"
            />
          </label>

          <label>
            Sustain
            <input id="sustain-level"
              type="range"
              orient="vertical"
            />
          </label>

          <label>
            Release
            <input id="release-time"
              type="range"
              orient="vertical"
            />
          </label>
        </div>
      </div>
    );
  }

});

module.exports = SynthEditor;
