import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/BookAppointment.css';
import logo from '../VitalCare.png';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmBookingModal from './ConfirmBookingModal';

function RescheduleAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentAppt = location.state?.appointment; // passed from ManageAppointments

  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentAppt) return navigate('/my-account');

    setSelectedTherapist(currentAppt.therapist_id); // default to current doctor

    axios.get('http://localhost:5000/api/therapists')
      .then(res => setTherapists(res.data));

    axios.get(`http://localhost:5000/api/availability/${currentAppt.therapist_id}`)
      .then(res => setAvailability(res.data));
  }, [currentAppt, navigate]);

  const handleConfirm = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/reschedule/${currentAppt.appointment_id}`, {
        availabilityId: selectedSlot.availability_id
      });
      alert("Appointment rescheduled!");
      setShowModal(false);
      navigate('/my-account');
    } catch (err) {
      console.error(err);
      alert("Failed to reschedule.");
    }
  };

  return (
    <div className="book-container">
      <header className="book-header">
        <button className="main-button" onClick={() => navigate('/my-account')}>Main</button>
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <h2 className="booking-title">Reschedule Appointment</h2>

      {/* Current Appointment Summary */}
      <div className="current-appointment-card">
        <p><strong>Current Date:</strong></p>
        <p>
          {new Date(currentAppt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(currentAppt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p><strong>Doctor:</strong> {currentAppt.doctor}</p>
        <p><strong>Type of Appointment:</strong> {currentAppt.concern}</p>
      </div>

      {/* Slot Selector */}
{availability.length > 0 && <p className="times-label">Available times:</p>}
<div className="timeslot-list">
  {availability.map(slot => {
    const formatted = `${new Date(slot.date).toLocaleDateString()} - ${slot.start_time}`;
    const isSelected = selectedSlot?.availability_id === slot.availability_id;

    return (
      <button
        key={slot.availability_id}
        className={`slot-button ${isSelected ? 'selected-slot' : ''}`}
        onClick={() => setSelectedSlot(slot)}
      >
        {formatted}
      </button>
    );
  })}
</div>


      {selectedSlot && (
        <button className="confirm-btn" onClick={() => setShowModal(true)}>
          Confirm Reschedule
        </button>
      )}

      {showModal && (
        <ConfirmBookingModal
          slot={selectedSlot}
          doctorName={currentAppt.doctor}
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default RescheduleAppointment;
