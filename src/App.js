import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import { createNote } from './graphql/mutations';

function App() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  const handleOnChangeNote = event => {
    setNote(event.target.value)
  }

  const handleAddNote = async event => {
    event.preventDefault();
    const input = { note };
    const result = await API.graphql(graphqlOperation(createNote, { input }))
    const newNote = result.data.createNote;
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setNote('');
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
        <button className="pa2 f4" type="submit">Add Note</button>
      </form>

      {/* Note List */}
      <div>
        {notes.map(item => (
          <div key={item.id} className="flex items-center">
            <li className="list pa1 f3">
              {item.note}
            </li>
            <button className="bg-transparent bn f4">
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
