import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/BookAppointment.css';
import logo from '../VitalCare.png';
import { useNavigate } from 'react-router-dom';
import ConfirmBookingModal from './ConfirmBookingModal';

function BookAppointment() {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionTypes, setSessionTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    // Retrieve Patients.patient_id stored during login
    const pid = localStorage.getItem('patientId');
    if (!pid) {
      // no patientId found, go back to login
      return navigate('/');
    }
    setPatientId(Number(pid));

    // Load therapists and session types
    axios.get('http://localhost:5000/api/therapists')
      .then(res => setTherapists(res.data))
      .catch(err => console.error('Error fetching therapists:', err));

    axios.get('http://localhost:5000/api/session-types')
      .then(res => setSessionTypes(res.data))
      .catch(err => console.error('Error fetching session types:', err));
  }, [navigate]);

  const handleTherapistChange = async (e) => {
    const therapistId = e.target.value;
    setSelectedTherapist(therapistId);
    setSelectedSlot(null);
    setSelectedTypeId('');
    try {
      const res = await axios.get(
        `http://localhost:5000/api/availability/${therapistId}`
      );
      setAvailability(res.data);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const handleConfirm = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/bookings', {
        patientId,
        therapistId: selectedTherapist,
        availabilityId: selectedSlot.availability_id,
        sessionTypeId: selectedTypeId
      });

      // success if 2xx
      if (res.status >= 200 && res.status < 300) {
        alert('Appointment booked successfully!');
        setShowConfirmModal(false);
        setSelectedSlot(null);
        setSelectedTypeId('');
        setAvailability(prev =>
          prev.filter(a => a.availability_id !== selectedSlot.availability_id)
        );
      } else {
        alert('Failed to book appointment.');
      }
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to book appointment.');
    }
  };

  const selectedTherapistName =
    therapists.find(t => t.therapist_id == selectedTherapist)?.name ||
    'Selected Therapist';

  return (
    <div className="book-container">
      <header className="book-header">
        <button className="main-button" onClick={() => navigate('/my-account')}>
          Main
        </button>
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <h2 className="booking-title">Appointment Booking</h2>

      <select
        className="dropdown"
        onChange={handleTherapistChange}
        value={selectedTherapist || ''}
      >
        <option value="" disabled>
          Select a Therapist
        </option>
        {therapists.map(t => (
          <option key={t.therapist_id} value={t.therapist_id}>
            {t.name}
          </option>
        ))}
      </select>

      {selectedTherapist && (
        <button
          className="view-reviews-btn"
          onClick={() =>
            navigate('/view-reviews', {
              state: { therapistId: selectedTherapist }
            })
          }
        >
          View Reviews for {selectedTherapistName}
        </button>
      )}

      {selectedTherapist && <p className="times-label">Available times:</p>}

      <div className="timeslot-list">
        {availability.map(slot => {
          const formatted =
            `${new Date(slot.date).toLocaleDateString()} - ${slot.start_time}`;
          const isSelected =
            selectedSlot?.availability_id === slot.availability_id;
          return (
            <button
              key={slot.availability_id}
              className={`slot-button ${isSelected ? 'selected-slot' : ''}`}
              onClick={() => {
                setSelectedSlot(slot);
                setSelectedTypeId('');
              }}
            >
              {formatted}
            </button>
          );
        })}
      </div>

      {selectedSlot && (
        <div className="concern-area">
          <label htmlFor="concern">Select Type:</label>
          <select
            id="concern"
            value={selectedTypeId}
            onChange={e => setSelectedTypeId(e.target.value)}
          >
            <option value="" disabled>
              Select type
            </option>
            {sessionTypes.map(type => (
              <option key={type.session_type_id} value={type.session_type_id}>
                {type.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSlot && selectedTypeId && (
        <button className="confirm-btn" onClick={() => setShowConfirmModal(true)}>
          Confirm Appointment
        </button>
      )}

      {showConfirmModal && (
        <ConfirmBookingModal
          slot={selectedSlot}
          doctorName={selectedTherapistName}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default BookAppointment;
