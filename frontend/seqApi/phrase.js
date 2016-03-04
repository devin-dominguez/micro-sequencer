var Util = require('./util.js');
var Note = require('./note.js');

//////////////
// CREATION //
//////////////

function Phrase(params) {
  this.length = params.length;
  this.notes = params.notes || [];

  this._setupChildren();
}

Phrase.prototype._setupChildren = function() {
  this.notes = this.notes.map(function(note) {
    return new Note(note);
  });
};

///////////////
// INTERFACE //
///////////////

Phrase.prototype.insertNote = function(noteParams) {
  var newNote = new Note(noteParams);

  this._validateNote(newNote);
  this._addNote(newNote);

  return newNote;
};

Phrase.prototype.removeNote = function(noteParams) {
  var note = new Note(noteParams);
  var idx = this._findNote(note);

  this.notes.splice(idx, 1);

  return note;
};

Phrase.prototype.transposeNoteTo = function(noteParams, pitch) {
  var targetNote = new Note(noteParams);
  var newNote = new Note(noteParams);
  newNote.pitch = pitch;

  this._changeNote(targetNote, newNote);

  return newNote;
};

Phrase.prototype.transposeNoteBy = function(noteParams, offset) {
  var targetNote = new Note(noteParams);
  var newNote = new Note(noteParams);
  newNote.pitch += offset;

  this._changeNote(targetNote, newNote);

  return newNote;
};

Phrase.prototype.translateNoteTo = function(noteParams, position) {
  var targetNote = new Note(noteParams);
  var newNote = new Note(noteParams);
  newNote.position = position;

  this._changeNote(targetNote, newNote);

  return newNote;
};

Phrase.prototype.translateNoteBy = function(noteParams, offset) {
  var targetNote = new Note(noteParams);
  var newNote = new Note(noteParams);
  newNote.position += offset;

  this._changeNote(targetNote, newNote);

  return newNote;
};

Phrase.prototype.resizeNoteTo = function(noteParams, duration) {
  var targetNote = new Note(noteParams);
  var newNote = new Note(noteParams);
  newNote.duration = duration;

  this._changeNote(targetNote, newNote);

  return newNote;
};

Phrase.prototype.resizeNoteBy = function(noteParams, offset) {
  var targetNote = new Note(noteParams);
  var newNote = new Note(noteParams);
  newNote.duration += offset;

  this._changeNote(targetNote, newNote);

  return newNote;
};

Phrase.prototype.moveNoteTo = function(noteParams, pitch, position) {
  var targetNote = new Note(noteParams);
  var newNote = new Note(noteParams);
  newNote.pitch = pitch;
  newNote.position = position;

  this._changeNote(targetNote, newNote);

  return newNote;
};

Phrase.prototype.copyNoteTo = function(noteParams, pitch, position) {
  var targetNote = new Note(noteParams);
  var newNote = new Note(noteParams);
  newNote.pitch = pitch;
  newNote.position = position;

  this.insertNote(newNote);

  return newNote;
};

Phrase.prototype.resize = function(newSize) {
  this.length = newSize;
  this._removeInvalidNotes();
};

/////////////
// METHODS //
/////////////

Phrase.prototype._addNote = function(note) {
  this.notes.push(new Note(note));
  this._sortNotes();
};

Phrase.prototype._changeNote = function(originalNote, newNote) {
  this.removeNote(originalNote);

  try {
    this.insertNote(newNote);
  } catch (error) {
    this.insertNote(originalNote);
    throw error;
  }
};

Phrase.prototype._findNote = function(targetNote) {
  for (var i = 0, l = this.notes.length; i < l; i++) {
    var note = this.notes[i];
    if (targetNote._eq(note)) {
      return i;
    }
  }

  throw new NoteNotFoundException(targetNote);
};

Phrase.prototype._validateNote = function(testNote) {
  this._checkBoundary(testNote);
  this._checkOverlap(testNote);
};

Phrase.prototype._checkOverlap = function(testNote) {
  this.notes.forEach(function(note) {
    if (testNote._isOverlapping(note) ) {
      throw new NoteOverlapException(testNote, note);
    }
  });
};

Phrase.prototype._checkBoundary = function(testNote) {
  if (testNote._end() >= this.length || testNote.position < 0) {
    throw new NoteOutOfBoundsException(testNote, this.length);
  }
};

Phrase.prototype._sortNotes = function() {
  this.notes.sort(function(noteA, noteB) {
    if (noteA.position === noteB.position) {
      return noteA.pitch - noteB.pitch;
    } else {
      return noteA.position - noteB.position;
    }
  });
};

Phrase.prototype._removeInvalidNotes = function() {
  this.notes = this.notes.filter(function(note) {
    try {
      this._validateNote(note);
      return true;
    } catch (e) {
      return false;
    }
  }, this);
};


////////////////
// EXCEPTIONS //
////////////////

function NoteOverlapException(attemptedNote, overlappingNote) {
  this.name = "NoteOverlapException";
  this.attemptedNote = attemptedNote;
  this.overlappingNote = overlappingNote;
  this.message = "Notes can't overlap";
}

function NoteOutOfBoundsException(attemptedNote, length) {
  this.name = "NoteOutOfBoundsException";
  this.attemptedNote = attemptedNote;
  this.length = length;
  this.message = "Note would fall out of bounds";
}

function NoteNotFoundException(targetNote) {
  this.name = "NoteNotFoundException";
  this.targetNote = targetNote;
}

/////////////
// EXPORTS //
/////////////

module.exports = Phrase;
