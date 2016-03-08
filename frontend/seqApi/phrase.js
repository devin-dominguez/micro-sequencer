var Note = require('./note.js');

//////////////
// CREATION //
//////////////

function Phrase(params) {
  this.length = params.length;

  this.notes = params.notes || {};
  Object.keys(this.notes).forEach(function(noteKey) {
    var note = params.notes[noteKey];
    this.notes[noteKey] =  new Note(note);
  }, this);
}

///////////////
// INTERFACE //
///////////////

Phrase.prototype.resize = function(newSize) {
  this.length = newSize;
  this._removeInvalidNotes();
};

Phrase.prototype.insertNote = function(noteParams) {
  var newNote = new Note(noteParams);

  this._validateNote(newNote);
  this._addNote(newNote);

  return newNote;
};

Phrase.prototype.removeNote = function(pitch, position) {
  var key = pitch * this.length + position;
  var note = this.notes[key];
  delete this.notes[key];

  return note;
};

Phrase.prototype.removeNotes = function(notes) {
  notes.forEach(function(note) {
    this.removeNote(note.pitch, note.position);
  }, this);
};

Phrase.prototype.transposeNoteTo = function(pitch, position, newPitch) {
  var originalNote = this.notes[pitch * this.length + position];
  var newNote = new Note(originalNote);
  newNote.pitch = newPitch;

  this._changeNote(pitch, position, newNote);

  return newNote;
};

Phrase.prototype.transposeNoteBy = function(pitch, position, offset) {
  var originalNote = this.notes[pitch * this.length + position];
  var newNote = new Note(originalNote);
  newNote.pitch += offset;

  this._changeNote(pitch, position, newNote);

  return newNote;
};

Phrase.prototype.translateNoteTo = function(pitch, position, newPosition) {
  var originalNote = this.notes[pitch * this.length + position];
  var newNote = new Note(originalNote);
  newNote.position = newPosition;

  this._changeNote(pitch, position, newNote);

  return newNote;
};

Phrase.prototype.translateNoteBy = function(pitch, position, offset) {
  var originalNote = this.notes[pitch * this.length + position];
  var newNote = new Note(originalNote);
  newNote.position += offset;

  this._changeNote(pitch, position, newNote);

  return newNote;
};

Phrase.prototype.resizeNoteTo = function(pitch, position, newDuration) {
  var originalNote = this.notes[pitch * this.length + position];
  var newNote = new Note(originalNote);
  newNote.duration = newDuration;

  this._changeNote(pitch, position, newNote);

  return newNote;
};

Phrase.prototype.resizeNoteBy = function(pitch, position, offset) {
  var originalNote = this.notes[pitch * this.length + position];
  var newNote = new Note(originalNote);
  newNote.duration += offset;

  this._changeNote(pitch, position, newNote);

  return newNote;
};

Phrase.prototype.resizeNotesBy = function(notes, offset) {
  var newNotes = [];
  notes.forEach(function(note) {
    var originalNote = this.notes[note.pitch * this.length + note.position];
    var newNote = new Note(originalNote);
    newNote.duration += offset;

    newNotes.push(newNote);
  }, this);

  return this._changeNotes(notes, newNotes);
};

Phrase.prototype.moveNoteTo = function(pitch, position, newPitch, newPosition) {
  var originalNote = this.notes[pitch * this.length + position];
  var newNote = new Note(originalNote);
  newNote.pitch = newPitch;
  newNote.position = newPosition;

  this._changeNote(pitch, position, newNote);

  return newNote;
};

Phrase.prototype.moveNotesBy = function(notes, pitchOffset, positionOffset) {
  var newNotes = [];
  notes.forEach(function(note) {
    var originalNote = this.notes[note.pitch * this.length + note.position];
    var newNote = new Note(originalNote);
    newNote.pitch += pitchOffset;
    newNote.position += positionOffset;

    newNotes.push(newNote);
  }, this);

  return this._changeNotes(notes, newNotes);
};

Phrase.prototype.copyNotesBy = function(notes, pitchOffset, positionOffset) {
  var newNotes = [];
  notes.forEach(function(note) {
    var originalNote = this.notes[note.pitch * this.length + note.position];
    var newNote = new Note(originalNote);
    newNote.pitch += pitchOffset;
    newNote.position += positionOffset;

    newNotes.push(newNote);
  }, this);

  return this._changeNotes([], newNotes);
};

Phrase.prototype.copyNoteTo = function(pitch, position, newPitch, newPosition) {
  var originalNote = this.notes[pitch * this.length + position];
  var newNote = new Note(originalNote);
  newNote.pitch = newPitch;
  newNote.position = newPosition;

  this.insertNote(newNote);

  return newNote;
};

/////////////
// METHODS //
/////////////

Phrase.prototype._addNote = function(note) {
  var key = note.pitch * this.length + note.position;
  this.notes[key] = new Note(note);
};

Phrase.prototype._changeNote = function(pitch, position, newNote) {
  var originalNote = this.removeNote(pitch, position);

  try {
    this.insertNote(newNote);
  } catch (error) {
    this.insertNote(originalNote);
    throw error;
  }
};

Phrase.prototype._changeNotes = function(notes, newNotes) {
  var originalNotes = [];
  notes.forEach(function(note) {
    originalNotes.push(this.removeNote(note.pitch, note.position));
  }, this);

  var success = newNotes.every(function(note) {
    try {
      this._validateNote(note);
      return true;
    } catch(e) {
      return false;
    }
  }, this);

  if (success) {
    newNotes.forEach(function(note) {
      this.insertNote(note);
    }, this);
    return newNotes;
  } else {
    originalNotes.forEach(function(note) {
      this.insertNote(note);
    }, this);
    return originalNotes;

  }
};

Phrase.prototype._validateNote = function(testNote) {
  this._checkBoundary(testNote);
  this._checkOverlap(testNote);
  testNote.checkPitch(testNote.pitch);
  testNote.checkDuration(testNote.duration);
};

Phrase.prototype._checkOverlap = function(testNote) {
  Object.keys(this.notes).forEach(function(noteKey) {
    var note = this.notes[noteKey];
    if (testNote.isOverlapping(note) ) {
      throw new NoteOverlapException(testNote, note);
    }
  }, this);
};

Phrase.prototype._checkBoundary = function(testNote) {
  if (testNote.end() >= this.length || testNote.position < 0) {
    throw new NoteOutOfBoundsException(testNote, this.length);
  }
};

Phrase.prototype._removeInvalidNotes = function() {
  var newNotes = {};
  Object.keys(this.notes).forEach(function(noteKey) {
    var note = this.notes[noteKey];
    try {
      this._checkBoundary(note);
      var newKey = note.pitch * this.length + note.position;
      newNotes[newKey] = note;
    } catch (e) { }
  }, this);
  this.notes = newNotes;
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
