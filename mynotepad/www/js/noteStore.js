angular.module('myNotes.noteStore', [])
.factory("noteStore", function() {
  
  var notes = angular.fromJson(window.localStorage["notes"] || "[]");
  // console.log(notes)
  var factory = {};

  factory.list = notes;

  function persist() {
    window.localStorage["notes"] = angular.toJson(notes)
  };


  factory.getNote = function(noteID) {
    for(i=0; i < notes.length; i++) {
      if (noteID == notes[i].id) {
        return notes[i]
      }
    }
  return undefined    
  };

  factory.updateNote = function(note) {
    for(i=0; i < notes.length; i++) {
      if (note.id == notes[i].id) {
        notes[i] = note
        persist()
        return 
      }
    }  
  };

  factory.createNote = function(note) {
    notes.push(note);
    persist();
  };

  factory.remove = function(noteId){
    for(i=0; i < notes.length; i++) {
      if (noteId == notes[i].id) {
        notes.splice(i,1);
        persist()
      }
    }
  };

  factory.move = function(note, fromIndex, toIndex) {
    notes.splice(fromIndex, 1);
    notes.splice(toIndex, 0, note);
    persist()
  };

  return factory
});