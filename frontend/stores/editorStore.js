var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var Phrase = require('../seqApi/phrase');
var EditorConstants = require('../constants/editorConstants');
var SeqConfig = require('../seqApi/config');

var _currentPhrase = new Phrase({length: 64});

var _noteCells = {};
var _selectedCells = {};
var _destinationCells = {};

var _selectedNote = null;
var _offset = 0;

function _cellKey(pitch, position) {
  return pitch * _currentPhrase.length + position;
}

function _resetCells() {
  _noteCells = {};
  _selectedCells = {};
  _destinationCells = {};

  _selectedNote = null;
  _offset = 0;
}

function _populateNoteCells() {
  _noteCells = {};

  _currentPhrase.notes.forEach(function(note) {
    var noteData = {
      note: note,
      type: ["note-start"]
    };

    var start = _cellKey(note.pitch, note.position);
    _noteCells[start] = JSON.parse(JSON.stringify(noteData));

    for (var tick = 1; tick < note.duration - 1; tick++) {
      noteData.type = ["note-continue"];
      _noteCells[start + tick] = JSON.parse(JSON.stringify(noteData));
    }
      noteData.type.push("note-end");
      _noteCells[start + note.duration - 1] = JSON.parse(JSON.stringify(noteData));
  });
}

function _setSelectedNote(note, position) {
  _selectedNote = note;
  _offset = position - note.position;
}

function _populateSelectedCells() {
  var note = _selectedNote;
  _selectedCells = {};
  for (var tick = 0; tick < note.duration; tick++) {
    var key = _cellKey(note.pitch, note.position) + tick;
    _selectedCells[key] = true;
  }
}

function _populateDestinationCells(pitch, position) {
  _destinationCells = {};
  for (var tick = 0; tick < _selectedNote.duration; tick++) {
    var rowPos = position + tick - _offset;
    if (rowPos < _currentPhrase.length && rowPos >= 0) {
      var key = _cellKey(pitch, position) + tick - _offset;
      _destinationCells[key] = true;
    }
  }
}

var EditorStore = new Store(Dispatcher);

EditorStore.__onDispatch = function(payload) {
  switch (payload.actionType) {

    case EditorConstants.INSERT_NOTE:
      _currentPhrase.insertNote(payload.noteParams);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.REMOVE_NOTE:
      _currentPhrase.removeNote(payload.noteParams);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.MOVE_NOTE_TO:
      _currentPhrase.moveNoteTo(payload.noteParams, payload.pitch, payload.position - _offset);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.REISZE_NOTE_TO:
      _currentPhrase.resizeNoteTo(payload.noteParams, payload.duration);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.SELECT_NOTE_FOR_RESIZE:
      _setSelectedNote(payload.noteParams, payload.cellPosition);
      _populateSelectedCells();
      this.__emitChange();
      break;

    case EditorConstants.DRAG_NOTE_OVER_CELL:
      _populateDestinationCells(payload.cellPitch, payload.cellPosition);
      this.__emitChange();
      break;

    case EditorConstants.DRAG_COMPLETED:
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;
  }
};

EditorStore.phraseLength = function() {
  return _currentPhrase.length;
};

EditorStore.getNoteCell = function(pitch, position) {
  return _noteCells[_cellKey(pitch, position)];
};

EditorStore.getSelectedCell = function(pitch, position) {
  return _selectedCells[_cellKey(pitch, position)];
};

EditorStore.getDestinationCell = function(pitch, position) {
  return _destinationCells[_cellKey(pitch, position)];
};

module.exports = EditorStore;
