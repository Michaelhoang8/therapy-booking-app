// TherapistAvailability.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';  // your axios instance

export default function TherapistAvailability() {
  const [date, setDate]         = useState('');
  const [startTime, setStart]   = useState('');
  const [endTime, setEnd]       = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();
  const therapistId            = 1;

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/api/availability', {
        therapistId,
        date,
        startTime,
        endTime
      });
      // on success, go back to dashboard or refresh
      navigate('/therapist');
    } catch (err) {
      console.error(err);
      setError('Could not add slot');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Add Availability Slot</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label>Date</label><br/>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Time</label><br/>
          <input
            type="time"
            value={startTime}
            onChange={e => setStart(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time</label><br/>
          <input
            type="time"
            value={endTime}
            onChange={e => setEnd(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Slot
        </button>
      </form>
    </div>
  );
}
