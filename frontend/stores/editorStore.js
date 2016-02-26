var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var Phrase = require('../seqApi/phrase');
var EditorConstants = require('../constants/editorConstants');
var SeqConfig = require('../seqApi/config');

var phrase = new Phrase({length: 16});
var notes = null;

var matrix = null;

var EditorStore = new Store(Dispatcher);


EditorStore.__onDispatch = function(payload) {
  switch (payload.actionType) {

    case EditorConstants.INSERT_NOTE:
      phrase.insertNote(payload.noteParams);
      notes = null;
      this.__emitChange();
      break;

    case EditorConstants.REMOVE_NOTE:
      phrase.removeNote(payload.noteParams);
      notes = null;
      this.__emitChange();
      break;

    case EditorConstants.MOVE_NOTE_TO:
      phrase.moveNoteTo(payload.noteParams, payload.pitch, payload.position);
      notes = null;
      this.__emitChange();
      break;

    case EditorConstants.REISZE_NOTE_TO:
      phrase.resizeNoteTo(payload.noteParams, payload.duration);
      notes = null;
      this.__emitChange();
      break;
  }
};

EditorStore.matrix = function() {
  if (!matrix) {
    matrix = [];
    for (var pitch = SeqConfig.MIN_PITCH; pitch <= SeqConfig.MAX_PITCH; pitch++) {
      matrix.push(buildRow(pitch));
    }
  }

  return matrix.reverse();
};

// Iterates through the row. If it finds a note it increments based on the
// duration of the found note.
function buildRow(pitch) {
  var row = [];
  var position = 0;
  while (position < phrase.length) {
    var data = {
      pitch: pitch,
      position: position,
      noteActions: []};

    var note = EditorStore.getNote(pitch, position);
    if (!note) {
      data.note = null;
      row[position] = JSON.parse(JSON.stringify(data));
    }

    else {

      data.note = note;

      data.noteActions.push("start");
      data.position = position;
      row[position] = JSON.parse(JSON.stringify(data));

      var duration = note.duration;
      while (duration > 1) {
        position++;
        data.noteActions = ["continue"];
        data.position = position;
        row[position] = JSON.parse(JSON.stringify(data));
        duration--;
      }

      data.noteActions.push("end");
      data.position = position;
      row[position] = JSON.parse(JSON.stringify(data));
    }

  position++;
  }

  return row;
}

function bundleData(note, position, pitch, noteActions) {
  return {
    note: note,
    position: position,
    pitch: pitch,
    noteActions: noteActions.slice()
  };
}



EditorStore.notes = function() {
  if (!notes) {
    notes = {};
    phrase.notes.forEach(function(note) {
      var key = note.pitch * phrase.length + note.position;
      notes[key] = note;
    });
  }
  return notes;
};

EditorStore.getNote = function(pitch, position) {
  var key = pitch * phrase.length + position;
  return EditorStore.notes()[key];
};

EditorStore.phrase = function() {
  return new Phrase(phrase);
};

module.exports = EditorStore;
