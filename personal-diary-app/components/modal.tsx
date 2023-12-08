import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react'; 
import { Tooltip } from 'react-tooltip';

type TodoItem = {
  text: string;
  completed: boolean;
};

const moods = [
  { emoji: '😊', label: 'Happy', description: 'Feeling good and happy' },
  { emoji: '😢', label: 'Sad', description: 'Feeling sad or unhappy' },
  { emoji: '😡', label: 'Angry', description: 'Feeling pissed of or frustrated' },
  { emoji: '🤔', label: 'Thoughtful', description: 'In a reflective mood. You are a thinker' },
  { emoji: '😴', label: 'Tired', description: 'Feeling hella tired' },
  { emoji: '💀', label: 'Dead', description: 'Feeling dead in either a funny way or a emo way' },
];


const DiaryEntryModal = ({ isOpen, onRequestClose, selectedDate }) => {
  const [entryText, setEntryText] = useState('');
  const [mood, setMood] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todoText, setTodoText] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    const validDate = selectedDate instanceof Date && !isNaN(selectedDate);
    const dateToSave = validDate ? selectedDate.toISOString() : new Date().toISOString();
  
    try {
      const session = await getSession();
        if (!session || !session.user) {
            throw new Error('No user session found');
        }
        const userId = session.user.id;

        const entryData = {
            text: entryText,
            mood,
            todos,
            date: dateToSave,
            userId
        };

      console.log('Selected Date:', selectedDate);
      console.log('Date to Save:', dateToSave);


        const response = await fetch('/api/entries', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(entryData),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to save entry');
        }

        setEntryText('');
        setMood('');
        setTodos([]);
        setCurrentStep(1);
        onRequestClose();
    } catch (error) {
        console.error('Error saving entry:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setEntryText('');
      setMood('');
      setTodos([]);
      setTodoText('');
      setCurrentStep(1);
    }
  }, [isOpen]);

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSelectMood = (selectedMood) => {
    setMood(selectedMood);
  };

  const handleAddTodo = () => {
    setTodos([...todos, { text: todoText, completed: false }]);
    setTodoText('');
  };

  const handleTodoTextChange = (e) => {
    setTodoText(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="p-5">
      <form onSubmit={handleEntrySubmit} className="bg-white rounded-lg shadow-xl p-6">
        {currentStep === 1 && (
          <div>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              placeholder="Write your diary entry..."
            />
            <button
              type="button"
              onClick={handleNextStep}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Next
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Select Your Mood</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
            {moods.map(({ emoji, label, description }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleSelectMood(label)}
                className={`px-4 py-2 rounded-lg ${mood === label ? 'bg-purple-300' : 'bg-gray-200'} hover:bg-purple-200`}
                data-tooltip-id="mood-tooltip"
                data-tooltip-content={description}
              >
                <span className="text-2xl">{emoji}</span>
              </button>
            ))}
            </div>
            <Tooltip id="mood-tooltip" />
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

{currentStep === 3 && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Add To-Do Items</h3>
            <input 
              type="text" 
              value={todoText} 
              onChange={handleTodoTextChange} 
              placeholder="Add a to-do item" 
              className="w-full text-sm text-gray-500 p-2 border border-gray-300 rounded-md"
            />
            <button 
              type="button" 
              onClick={handleAddTodo} 
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Add To-Do
            </button>
            <ul className="mt-4">
              {todos.map((todo, index) => (
                <li key={index}>{todo.text}</li>
              ))}
            </ul>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Entry
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default DiaryEntryModal;
