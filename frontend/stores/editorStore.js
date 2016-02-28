var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var Phrase = require('../seqApi/phrase');
var EditorConstants = require('../constants/editorConstants');

var _currentPhrase = new Phrase({length: 64});

var _error = "";

var _cells = [];
var _noteCells = {};
var _selectedCells = {};
var _destinationCells = {};
var _selectedNote = null;
var _offset = 0;

function _cellKey(pitch, position) {
  return pitch * _currentPhrase.length + position; } function _resetCells() {
  _noteCells = {};
  _selectedCells = {};
  _destinationCells = {};
  _selectedNote = null;
  _offset = 0;
}

function _populateNoteCells() {
  _noteCells = {};

  _currentPhrase.notes.forEach(function(note) {
    for (var tick = 0; tick < note.duration; tick++) {
      var key = _cellKey(note.pitch, note.position) + tick;
      _noteCells[key] = note;
    }
  });
}

function _setSelectedNote(note, position) {
  console.log("settingNote");
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
      _destinationCells[key] = {
        position: Math.max(position - _offset, 0),
        duration: _selectedNote.duration + Math.min(0, position - _offset)
      };
    }
  }
}

function _populateDestinationCellsForResize(endPosition) {
  _destinationCells = {};
  var newDuration = endPosition - _selectedNote.position + 1;
  var key = _cellKey(_selectedNote.pitch, _selectedNote.position);
  _destinationCells[key] = {
    position: _selectedNote.position,
    duration: Math.max(1, newDuration)
  };
}

function _populateCells() {
  var noteKeys = Object.keys(_noteCells);
  var selectedKeys = Object.keys(_selectedCells);
  var destinationKeys = Object.keys(_destinationCells);

  var allKeys = noteKeys.concat(selectedKeys).concat(destinationKeys);

  var foundKeys = {};
  var uniqueKeys = allKeys.filter(function(key) {
    if (foundKeys[key]) {
      return false;
    }
    foundKeys[key] = true;
    return true;
  });

  _cells = uniqueKeys.map(function(key) {
    return {
      key: key,
      note: _noteCells[key],
      selected: _selectedCells[key],
      destination: _destinationCells[key],
      pitch: 0 | key / _currentPhrase.length,
      position: key % _currentPhrase.length
    };
  });
}

var EditorStore = new Store(Dispatcher);

EditorStore.__onDispatch = function(payload) {
  switch (payload.actionType) {

    case EditorConstants.LOAD_PHRASE:
      _error = "";
      _currentPhrase = new Phrase(payload.phrase);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.INSERT_NOTE:
      _error = "";
      try {
        _currentPhrase.insertNote(payload.noteParams);
      } catch (error) {
        _error = error.message;
      }
      _resetCells();
      _populateNoteCells();
      _populateCells();
      this.__emitChange();
      break;

    case EditorConstants.REMOVE_NOTE:
      _error = "";
      try {
        _currentPhrase.removeNote(payload.noteParams);
      } catch (error) {
        _error = error.message;
      }
      _resetCells();
      _populateNoteCells();
      _populateCells();
      this.__emitChange();
      break;

    case EditorConstants.MOVE_NOTE_TO:
      _error = "";
      try {
        _currentPhrase.moveNoteTo(_selectedNote, payload.pitch, payload.position - _offset);
      } catch (error) {
        _error = error.message;
      }
      _resetCells();
      _populateNoteCells();
      _populateCells();
      this.__emitChange();
      break;

    case EditorConstants.REISZE_NOTE_TO:
      _error = "";
      try {
        _currentPhrase.resizeNoteTo(_selectedNote,
            Math.max(1, payload.endPosition - _selectedNote.position + 1));
      } catch (error) {
        _error = error.message;
      }
      _resetCells();
      _populateNoteCells();
      _populateCells();
      this.__emitChange();
      break;

    case EditorConstants.SELECT_NOTE:
      _error = "";
      _setSelectedNote(payload.noteParams, payload.cellPosition);
      _populateSelectedCells();
      _populateCells();
      this.__emitChange();
      break;

    case EditorConstants.DRAG_NOTE_OVER_CELL:
      _error = "";
      _populateDestinationCells(payload.cellPitch, payload.cellPosition);
      _populateCells();
      this.__emitChange();
      break;

    case EditorConstants.DRAG_NOTE_OVER_CELL_FOR_RESIZE:
      _error = "";
      _populateDestinationCellsForResize(payload.cellPosition);
      _populateCells();
      this.__emitChange();
      break;
  }
};

EditorStore.phraseLength = function() {
  return _currentPhrase.length;
};

EditorStore.phrase = function() {
  return new Phrase(_currentPhrase);
};

EditorStore.cells = function() {
  return _cells.slice();
};

EditorStore.error = function() {
  return _error;
};

module.exports = EditorStore;
