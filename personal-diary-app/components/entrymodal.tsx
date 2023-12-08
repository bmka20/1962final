import Modal from 'react-modal';
import { useState, useEffect } from 'react';

const EntryModal = ({ isOpen, onRequestClose, entry, refreshEntries }) => {
  const [entryState, setEntryState] = useState(entry);

  useEffect(() => {
    setEntryState(entry);
  }, [entry]);

  const toggleTodo = async (index) => {
    try {
      const updatedTodos = entryState.todos.map((todo, i) => {
        if (i === index) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });

      const response = await fetch(`/api/entries?entryId=${entryState._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos: updatedTodos }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      setEntryState({ ...entryState, todos: updatedTodos });
      refreshEntries();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (!entryState) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="p-5">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Diary Entry Details</h3>
        <p><strong>Text:</strong> {entry.text}</p>
        <p><strong>Mood:</strong> {entry.mood}</p>
        {entryState.todos && entryState.todos.length > 0 && (
          <>
            <h4 className="text-lg font-semibold mb-2">Todos:</h4>
            <ul>
            {entryState.todos.map((todo, index) => (
              <li 
                key={index}
                className={`cursor-pointer ${todo.completed ? 'line-through' : ''}`}
                onClick={() => toggleTodo(index)}
              >
                {index + 1}. {todo.text}
              </li>
            ))}
            </ul>
          </>
        )}
        <button className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onRequestClose}>Close</button>
      </div>
    </Modal>
  );
};

export default EntryModal;

