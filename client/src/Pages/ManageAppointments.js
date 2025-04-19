import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/ManageAppointments.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ConfirmCancellationModal from './ConfirmCancellationModal';
import logo from '../VitalCare.png';

function ManageAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    const decoded = jwtDecode(token);
    setPatientName(decoded.username);

    axios
      .get(`http://localhost:5000/api/appointments/?patientId=${decoded.id}`)
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch appointments', err);
      });
  }, [navigate]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await axios.patch(`http://localhost:5000/api/appointmentcancel/${appointmentId}/cancel`);
      setAppointments(prev => prev.filter(appt => appt.appointment_id !== appointmentId));
      setSelectedAppt(null);
      alert("Appointment cancelled.");
    } catch (err) {
      console.error("Failed to cancel:", err);
      alert("Failed to cancel appointment.");
    }
  };

  return (
    <div className="manage-container">
      <header className="manage-header">
        <button className="main-button" onClick={() => navigate('/my-account')}>Main</button>
        <img src={logo} alt="VitalCare Logo" className="logo" />
      </header>

      <h2 className="manage-title">Manage Appointments</h2>
      <p className="patient-name">{patientName}’s</p>

      <div className="appointment-table">
        <div className="table-header">
          <div>Date</div>
          <div>Time</div>
          <div>Doctor</div>
          <div>Concern</div>
          <div>Actions</div>
        </div>

        {appointments.map((appt) => {
          const date = new Date(appt.date);
          return (
            <div className="table-row" key={appt.appointment_id}>
              <div>{date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div>{appt.doctor}</div>
              <div>{appt.concern}</div>
              <div>
                <button
                  className="reschedule-btn"
                  onClick={() => navigate('/reschedule-appointment', { state: { appointment: appt } })}
                >
                  Reschedule
                </button>

                <button className="filler-btn" disabled>_______</button>

                <button
                  className="cancel-btn"
                  onClick={() => setSelectedAppt(appt)}
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAppt && (
        <ConfirmCancellationModal
          appointment={selectedAppt}
          onCancel={() => setSelectedAppt(null)}
          onConfirm={handleCancelAppointment}
        />
      )}
    </div>
  );
}

export default ManageAppointments;
