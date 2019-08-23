import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

function App() {
  const [id, setId] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await API.graphql(graphqlOperation(listNotes));
      setNotes(result.data.listNotes.items);
    }
    fetchData();
  }, []);

  const handleOnChangeNote = event => {
    setNote(event.target.value)
  }

  const handleAddNote = async event => {
    event.preventDefault();

    if (hasExistingNote()) {
      handleUpdateNote()
    } else {
      const input = { note };
      const result = await API.graphql(graphqlOperation(createNote, { input }))
      const newNote = result.data.createNote;
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      setNote('');
    }
  }

  const handleUpdateNote = async () => {
    const input = { id, note };
    const result = await API.graphql(graphqlOperation(updateNote, { input }));
    const updatedNote = result.data.updateNote;
    const index = notes.findIndex(note => note.id === updatedNote.id);
    const updatedNotes = [
      ...notes.slice(0, index),
      updatedNote,
      ...notes.slice(index + 1)
    ];
    setNotes(updatedNotes)
  }

  const handleDeleteNote = async noteId => {
    const input = { id: noteId };
    const result = await API.graphql(graphqlOperation(deleteNote, { input }));
    const deletedNoteId = result.data.deleteNote.id;
    const updatedNotes = notes.filter(note => note.id !== deletedNoteId);
    setNotes(updatedNotes);
  }

  const handleSetNote = ({ id, note }) => {
    setId(id);
    setNote(note);
  }

  const hasExistingNote = () => {
    if (id) {
      const isNote = notes.findIndex(note => note.id === id) > -1;
      return isNote;
    }

    return false;
  }

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">
        Amplify Notetaker
      </h1>
      {/* Note Form */}
      <form onSubmit={handleAddNote} className="mb3">
        <input
          type="text"
          className="pa2 f4"
          placeholder="Write your note"
          onChange={handleOnChangeNote}
          value={note}
        />
        <button className="pa2 f4" type="submit">
          { id ? "Update Note" : "Add Note" }
        </button>
      </form>

      {/* Note List */}
      <div>
        {notes.map(item => (
          <div key={item.id} className="flex items-center">
            <li onClick={() => handleSetNote(item)} className="list pa1 f3">
              {item.note}
            </li>
            <button onClick={() => handleDeleteNote(item.id)} className="bg-transparent bn f4">
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div> 
  );
}

export default withAuthenticator(App, {
  includeGreetings: true
});
