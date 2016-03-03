var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var Phrase = require('../seqApi/phrase');
var EditorConstants = require('../constants/editorConstants');

window.defaultComposition = {
  settings: {
    tempo: 125,
    hilite: 4,
    tpb: 4
  },

  tracks: [
    {
      type: "sawtooth",
      attackTime: 0.05,
      decayTime: 0.075,
      sustainLevel: 0.25,
      releaseTime: 0.1,
      volume: 0.15,
      pan: 0,
    },

    {
      type: "sawtooth",
      attackTime: 0.01,
      decayTime: 0.075,
      sustainLevel: 0.25,
      releaseTime: 0.1,
      volume: 0.15,
      pan: 0,
    },

    {
      type: "square",
      attackTime: 0.01,
      decayTime: 0.075,
      sustainLevel: 0.25,
      releaseTime: 0.1,
      volume: 0.15,
      pan: 0,
    }
  ],

  sequence: [0],

  patterns: {
    0: {
      length: 64,
      phrases: [
        new Phrase({length: 64}),
        new Phrase({length: 64}),
        new Phrase({length: 64})
      ]
    }
  }
};

var _title = "Untitled Composition";
var _public = true;

var _composition;
var _currentSeqIdx;

var _currentPatternId;
var _currentPattern;

var _currentTrackIdx;
var _currentTrack;
var _currentPhrase;

var _error = "";

var _cells = [];
var _noteCells = {};
var _selectedCells = {};
var _destinationCells = {};
var _selectedNote = null;
var _offset = 0;

_loadComposition(JSON.stringify(window.defaultComposition));

var _selectedKey = null;

function _parseComposition(compoStr) {
  var composition =  JSON.parse(compoStr);
  Object.keys(composition.patterns).forEach(function(patternId) {
    composition.patterns[patternId].phrases =
      composition.patterns[patternId].phrases.map(function(phrase) {
        return new Phrase(phrase);
      });
  });

  return composition;
}

function _loadComposition(compoString) {
  _composition = _parseComposition(compoString);
  _currentSeqIdx = 0;

  _currentPatternId = _composition.sequence[_currentSeqIdx];
  _currentPattern = _composition.patterns[_currentPatternId];

  _currentTrackIdx = 0;
  _currentTrack = _composition.tracks[_currentTrackIdx];
  _currentPhrase = _currentPattern.phrases[_currentTrackIdx];
}

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
    for (var tick = 0; tick < note.duration; tick++) {
      var key = _cellKey(note.pitch, note.position) + tick;
      _noteCells[key] = {
        note: note,
        pitch: note.pitch,
        position: note.position + tick
      };
    }
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
  var headPos = Math.min(_currentPhrase.length -_selectedNote.duration,
      Math.max(position - _offset, 0));
  var key = _cellKey(pitch, headPos);
  _destinationCells[key] = {
    pitch: pitch,
    position: headPos,
    duration: _selectedNote.duration
  };
}

function _populateDestinationCellsForResize(endPosition) {
  _destinationCells = {};
  var newDuration = endPosition - _selectedNote.position + 1;
  var key = _cellKey(_selectedNote.pitch, _selectedNote.position);
  _destinationCells[key] = {
    pitch: _selectedNote.pitch,
    position: _selectedNote.position,
    duration: Math.max(1, newDuration)
  };
}

function _updateSynth(trackIdx, newParams) {
  var track = _composition.tracks[trackIdx];
  Object.keys(track).forEach(function(param) {
    if (param !== "type") {
      newParams[param] = Number(newParams[param]);
    }
    track[param] = newParams[param] || track[param];
  });
}

function _selectTrack(trackIdx) {
  _currentTrackIdx = trackIdx;
  _currentTrack = _composition.tracks[_currentTrackIdx];
  _currentPhrase = _currentPattern.phrases[_currentTrackIdx];
}

var EditorStore = new Store(Dispatcher);

EditorStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case EditorConstants.LOAD_COMPOSITION:
      _title = payload.composition.title;
      _loadComposition(payload.composition.composition);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.SELECT_TRACK:
      _selectTrack(payload.trackIdx);
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
      this.__emitChange();
      break;

    case EditorConstants.MOVE_NOTE_TO:
      _error = "";
      try {
        _currentPhrase.moveNoteTo(_selectedNote, payload.pitch,
            Math.min(_currentPhrase.length - _selectedNote.duration,
              Math.max(0, payload.position - _offset)));
      } catch (error) {
        _error = error.message;
      }
      _resetCells();
      _populateNoteCells();
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
      this.__emitChange();
      break;

    case EditorConstants.SELECT_NOTE:
      _setSelectedNote(payload.noteParams, payload.cellPosition);
      _populateSelectedCells();
      this.__emitChange();
      break;

    case EditorConstants.DRAG_NOTE_OVER_CELL:
      _populateDestinationCells(payload.cellPitch, payload.cellPosition);
      this.__emitChange();
      break;

    case EditorConstants.DRAG_NOTE_OVER_CELL_FOR_RESIZE:
      _populateDestinationCellsForResize(payload.cellPosition);
      this.__emitChange();
      break;

    case EditorConstants.SELECT_KEY:
      _selectedKey = payload.keyPitch;
      this.__emitChange();
      break;

    case EditorConstants.SET_TEMPO:
      _composition.settings.tempo = payload.tempo;
      this.__emitChange();
      break;

    case EditorConstants.UPDATE_SYNTH:
      _updateSynth(payload.trackIdx, payload.synthParams);
      this.__emitChange();
      break;
  }
};

EditorStore.phraseLength = function() {
  return _currentPhrase.length;
};

EditorStore.noteCells = function() {
  return Object.keys(_noteCells).map(function(key) {
    return {
      key: key,
      note: _noteCells[key].note,
      pitch: _noteCells[key].pitch,
      position: _noteCells[key].position,
      selected: _selectedCells[key],
    };
  });
};

EditorStore.destinationCells = function() {
  return Object.keys(_destinationCells).map(function(key) {
    return _destinationCells[key];
  });
};

EditorStore.selectedKey = function() {
  return _selectedKey;
};

EditorStore.error = function() {
  return _error;
};

EditorStore.composition = function() {
  return _composition;
};


EditorStore.phrase = function() {
  return _currentPhrase;
};

EditorStore.currentTrackIdx = function() {
  return _currentTrackIdx;
};

EditorStore.currentTrack = function() {
  return _currentTrack;
};

EditorStore.tracks = function() {
  return _composition.tracks;
};

EditorStore.track = function(trackIdx) {
  return _composition.tracks[trackIdx];

};

EditorStore.tempo = function() {
  return _composition.settings.tempo;
};

module.exports = EditorStore;
//var _currentTrack = _composition.tracks[_currentTrackIdx];
//var _currentPattern = _composition.patterns[0];
//var _currentPhrase = _currentPattern.phrases[_currentTrackIdx];
