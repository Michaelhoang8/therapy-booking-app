import React from 'react';
import "../Styles/ConfirmCancellationModal.css";

const ConfirmCancellationModal = ({ onCancel, onConfirm, appointment }) => {
  if (!appointment) return null;

  const dateObj = new Date(appointment.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const startTime = appointment.date
    ? new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onCancel}>
          &times;
        </button>
        <h1>Confirm cancellation</h1>
        <p>
          Are you sure you want to cancel your appointment on <strong>{formattedDate}</strong> at <strong>{startTime}</strong> with <strong>{appointment.doctor}</strong>?
        </p>
        <div className="modal-buttons">
          <button className="modal-button cancel-button" onClick={onCancel}>
            No
          </button>
          <button
            className="modal-button confirm-button"
            onClick={() => onConfirm(appointment.appointment_id)}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancellationModal;
