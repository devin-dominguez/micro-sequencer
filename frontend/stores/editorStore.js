var Dispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var EditorConstants = require('../constants/editorConstants');
var CompositionConstants = require('../constants/compositionConstants');

var Composition = require('../seqApi/composition');

var defaultComposition = {
  settings: {
    tempo: 125,
    hilite: 4,
    tpb: 4
  },

  tracks: [ {}, {}, {}, {}],

  sequence: [0],

  patterns: {
    0: {
      length: 128,
      phrases: [{length: 128}, {length: 128}, {length: 128}, {length: 128}]
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

var _noteCells = {};
var _selectedCells = {};
var _destinationCells = {};

var _selectedNotes = {};

var _startPitch = null;
var _startPosition = null;
var _endPitch = null;
var _endPosition = null;

var _selectedKey = null;

function _loadComposition(compoString) {
  _composition = new Composition(JSON.parse(compoString));
  _currentSeqIdx = 0;

  _currentPatternId = _composition.sequence[_currentSeqIdx];
  _currentPattern = _composition.patterns[_currentPatternId];

  _currentTrackIdx = 0;
  _currentTrack = _composition.tracks[_currentTrackIdx];
  _currentPhrase = _currentPattern.phrases[_currentTrackIdx];
}

function _resetCells() {
  _noteCells = {};
  _selectedCells = {};
  _destinationCells = {};

  _selectedNotes = {};

  _startPitch = null;
  _startPosition = null;
  _endPitch = null;
  _endPosition = null;
}

function _populateNoteCells() {
  _noteCells = {};

  Object.keys(_currentPhrase.notes).forEach(function(noteKey) {
    var note = _currentPhrase.notes[noteKey];
    for (var tick = 0; tick < note.duration; tick++) {
      var key = note.pitch * _currentPhrase.length + note.position + tick;
      _noteCells[key] = {
        note: note,
        pitch: note.pitch,
        position: note.position + tick
      };
    }
  });
}

function _toggleSelectedNote(note) {
  var key = note.pitch * _currentPhrase.length + note.position;
  if (_selectedNotes[key]) {
    delete _selectedNotes[key];
  } else {
    _selectedNotes[key] = note;
  }
}

function _populateSelectedCells() {
  _selectedCells = {};
  Object.keys(_selectedNotes).forEach(function(noteKey) {
    var note = _selectedNotes[noteKey];
    for (var tick = 0; tick < note.duration; tick++) {
      var key = note.pitch * _currentPhrase.length + note.position + tick;
      _selectedCells[key] = true;
    }
  }, this);

}

function _populateDestinationCellsForMove() {
  _destinationCells = {};
  Object.keys(_selectedNotes).forEach(function(noteKey) {
    var note = _selectedNotes[noteKey];
    var newPitch = note.pitch + (_endPitch - _startPitch);
    var newPosition = note.position + (_endPosition - _startPosition);
    var valid = newPosition >= 0 &&
     (newPosition + note.duration - 1) < _currentPhrase.length;

    var newKey = newPitch * _currentPhrase.length + newPosition;

    _destinationCells[newKey] = {
      pitch: newPitch,
      position: newPosition,
      duration: note.duration,
      valid: valid
    };
  }, this);
}

function _populateDestinationCellsForResize() {
  _destinationCells = {};
  Object.keys(_selectedNotes).forEach(function(noteKey) {
    var note = _selectedNotes[noteKey];
    var newDuration = note.duration + (_endPosition - _startPosition);
    var valid = newDuration > 0 &&
      (note.position + newDuration - 1) < _currentPhrase.length;

    var newKey = note.pitch * _currentPhrase.length + note.position;
    _destinationCells[newKey] = {
      pitch: note.pitch,
      position: note.position,
      duration: newDuration,
      valid: valid
    };
  }, this);
}

function _resizeSelectedNotes() {
  var durationOffset = _endPosition - _startPosition;
  var notes = Object.keys(_selectedNotes).map(function(noteKey) {
    return _selectedNotes[noteKey];
  });

  var resultNotes = _currentPhrase.resizeNotesBy(notes, durationOffset);
  _resetCells();

  _selectedNotes = {};
  resultNotes.forEach(function(note) {
    var key = note.pitch * _currentPhrase.length + note.position;
    _selectedNotes[key] = note;
  });

}

function _moveSelectedNotes(copying) {
  var pitchOffset = _endPitch - _startPitch;
  var positionOffset = _endPosition - _startPosition;

  var notes = Object.keys(_selectedNotes).map(function(noteKey) {
    return _selectedNotes[noteKey];
  });

  if (copying) {
    var resultNotes = _currentPhrase.copyNotesBy(notes, pitchOffset, positionOffset);
  } else {
    var resultNotes = _currentPhrase.moveNotesBy(notes, pitchOffset, positionOffset);
  }
  _resetCells();

  _selectedNotes = {};
  resultNotes.forEach(function(note) {
    var key = note.pitch * _currentPhrase.length + note.position;
    _selectedNotes[key] = note;
  });

}

function _updateCompositionSettings(newParams) {
  if (typeof newParams.public !== "undefined") {
    _public = newParams.public;
  }


  _composition.settings.tpb = Number(newParams.tpb) || _composition.settings.tpb;
  _composition.settings.hilite = Number(newParams.hilite) || _composition.settings.hilite;

  if (typeof newParams.length !== "undefined") {
    _currentPattern.resize(Number(newParams.length));
  }
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
    case EditorConstants.INSERT_NOTE:
      _currentPhrase.insertNote(payload.note);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.REMOVE_NOTE:
      _currentPhrase.removeNote(payload.pitch, payload.position);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.SELECT_NOTE:
      var key = payload.note.pitch * _currentPhrase.length + payload.note.position;
      _selectedNotes[key] = payload.note;
      _populateSelectedCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.DESELECT_NOTE:
      var key = payload.note.pitch * _currentPhrase.length + payload.note.position;
      delete _selectedNotes[key];
      _populateSelectedCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.TOGGLE_NOTE_SELECTION:
      _toggleSelectedNote(payload.note);
      _populateSelectedCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.CLEAR_NOTE_SELECTION:
      _selectedNotes = {};
      _populateSelectedCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.START_MOVE_DRAG:
      _startPitch = payload.startPitch;
      _startPosition = payload.startPosition;
      _endPitch = payload.startPitch;
      _endPosition = payload.endPosition;
      this.__emitChange();
      break;

    case EditorConstants.CONTINUE_MOVE_DRAG:
      _endPitch = payload.endPitch;
      _endPosition = payload.endPosition;
      _populateDestinationCellsForMove();
      _populateSelectedCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.COMPLETE_MOVE_DRAG:
      _moveSelectedNotes(payload.copying);
      _populateSelectedCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.START_RESIZE_DRAG:
      _startPitch = 0;
      _startPosition = payload.startPosition;
      _endPitch = 0;
      _endPosition = payload.endPosition;
      this.__emitChange();
      break;

    case EditorConstants.CONTINUE_RESIZE_DRAG:
      _endPitch = 0;
      _endPosition = payload.endPosition;
      _populateDestinationCellsForResize();
      _populateSelectedCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.COMPLETE_RESIZE_DRAG:
      _resizeSelectedNotes();
      _populateSelectedCells();
      _populateNoteCells();
      this.__emitChange();
      break;


    case CompositionConstants.CREATE_COMPOSITION:
    case CompositionConstants.UPDATE_COMPOSITION:
    case CompositionConstants.LOAD_COMPOSITION:
      _title = payload.composition.title;
      _public = payload.composition.public;
      _loadComposition(payload.composition.composition);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case CompositionConstants.NEW_COMPOSITION:
      _title = "Untitled Composition";
      _loadComposition(JSON.stringify(defaultComposition));
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.RESIZE_PATTERN:
      var pattern = _composition.patterns[payload.patternId];
      pattern.resize(Math.min(1024, Math.max(1, payload.newSize)));
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

    case EditorConstants.ADD_TRACK:
      _composition.addTrack();
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;

    case EditorConstants.REMOVE_TRACK:
      _composition.removeTrack(payload.trackIdx);
       _selectTrack(Math.min(_composition.tracks.length - 1,
             Math.max(0, payload.trackIdx)));
      _resetCells();
      _populateNoteCells();
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

    case EditorConstants.UPDATE_COMPOSITION_SETTINGS:
      _updateCompositionSettings(payload.newParams);
      _resetCells();
      _populateNoteCells();
      this.__emitChange();
      break;
  }
};

EditorStore.compositionData = function() {
  return {
    title: _title,
    "public": _public,
    composition: JSON.stringify(_composition)
  };
};

EditorStore.title = function() {
  return _title.slice();
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

EditorStore.numSelected = function() {
  return Object.keys(_selectedNotes).length;
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

EditorStore.tpb = function() {
  return _composition.settings.tpb;
};

EditorStore.hilite = function() {
  return _composition.settings.hilite;
};

EditorStore.isPublic = function() {
  return _public;
};

module.exports = EditorStore;
