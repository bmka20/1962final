import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import DiaryModal from '../components/modal';
import 'react-calendar/dist/Calendar.css';
import RootLayout from '../components/layout';
import EntryModal from '@/components/entrymodal';

const DiaryEntriesPage = () => {
  const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchEntries = async (selectedDate) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/entries?date=${selectedDate.toISOString()}`, {
        credentials: 'include' 
      });
      if (!res.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await res.json();
      setEntries(data.entries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(date);
  }, [date]);

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
    if (!modalIsOpen) {
      fetchEntries(date);
    }
  };

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setDetailsModalOpen(true);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <RootLayout>
      <div className="container mx-auto p-4 flex flex-col items-center">
        <button 
          onClick={toggleModal}
          className="mb-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Create New Entry
        </button>
        <Calendar
          onChange={onDateChange}
          value={date}
          className="w-full max-w-md"
        />
        {isLoading && <p>Loading entries...</p>}
        <div className="mt-4">
          {entries.length > 0 ? (
            entries.map(entry => (
              <div 
                key={entry._id} 
                className="p-4 bg-white rounded shadow mb-2 cursor-pointer"
                onClick={() => handleEntryClick(entry)}
              >
                <p>{truncateText(entry.text, 100)}</p> 
              </div>
            ))
          ) : (
            <p>No entries for this date.</p>
          )}
        </div>
        <DiaryModal isOpen={modalIsOpen} onRequestClose={toggleModal} selectedDate={date}/>
        <EntryModal isOpen={detailsModalOpen} onRequestClose={() => setDetailsModalOpen(false)} entry={selectedEntry} />
      </div>
    </RootLayout>
  );
};

export default DiaryEntriesPage;
