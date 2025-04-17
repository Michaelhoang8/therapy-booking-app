import React from 'react';
import "../Styles/ConfirmationBookingModal.css";

const ConfirmBookingModal = ({ onCancel, onConfirm, slot, doctorName }) => {
  if (!slot) return null;

  const dateObj = new Date(slot.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = slot.start_time.slice(0, 5); // assumes format like "08:00:00"

  return (
    <div className="modal-overlay">
  <div className="modal-content">
    <button className="close-button" onClick={onCancel}>
      &times;
    </button>
    <h1>Confirm Booking</h1>
    <p>Are you sure you want to confirm the following appointment?</p>
    <div className="appointment-card">
      <div className="date-section">
        <span className="date">{dateObj.getDate()}</span>
        <span className="month">{dateObj.toLocaleString('en-US', { month: 'short' })}</span>
      </div>
      <div className="details-section">
        <p className="time">{formattedTime}</p>
        <p className="doctor">{doctorName}</p>
      </div>
    </div>
    <div className="modal-buttons">
      <button className="modal-button cancel-button" onClick={onCancel}>No</button>
      <button className="modal-button confirm-button" onClick={() => onConfirm(slot)}>Yes</button>
    </div>
  </div>
</div>

  );
};

export default ConfirmBookingModal;
