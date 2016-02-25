var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var Phrase = require('../seqApi/phrase');
var EditorConstants = require('../constants/editorConstants');

var phrase = new Phrase({length: 16});

var EditorStore = new Store(Dispatcher);

EditorStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case "RANDOMIZE":
      EditorStore.randomize();
      this.__emitChange();
      break;

    case EditorConstants.INSERT_NOTE:
      phrase.insertNote(payload.noteParams);
      this.__emitChange();
      break;

    case EditorConstants.REMOVE_NOTE:
      phrase.removeNote(payload.noteParams);
      this.__emitChange();
      break;

    case EditorConstants.MOVE_NOTE_TO:
      phrase.moveNoteTo(payload.noteParams, payload.pitch, payload.position);
      this.__emitChange();
      break;

    case EditorConstants.REISZE_NOTE_TO:
      phrase.resizeNoteTo(payload.noteParams, payload.duration);
      this.__emitChange();
      break;
  }
};


EditorStore.randomize = function() {
  phrase = new Phrase({length: 64});

  for (var i = 0; i < 512; i++) {
    var note = {
      pitch: 0 | Math.random() * 128,
      position: 0 | Math.random() * 64,
      duration: 0 | Math.random() * 8 + 1
    };

    try {
      phrase.insertNote(note);
    } catch (error) {
    }
  }
};


EditorStore.phrase = function() {
  return new Phrase(phrase);
};

module.exports = EditorStore;
