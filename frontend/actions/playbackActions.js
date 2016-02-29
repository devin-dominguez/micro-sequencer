var Dispatcher = require('../dispatcher/dispatcher');
var PlaybackConstants = require('../constants/playbackConstants');

module.exports = {
  demoNoteOn: function(pitch) {
    Dispatcher.dispatch({
      actionType: PlaybackConstants.DEMO_NOTE_ON,
      pitch: pitch
    });
  },

  demoNoteOff: function() {
    Dispatcher.dispatch({
      actionType: PlaybackConstants.DEMO_NOTE_OFF
    });
  }

};
