import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../Styles/Notifications.css';
import vitalcarelogo from '../VitalCare.png';

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);

      axios
        .get(`http://localhost:5000/api/notifications?userId=${decoded.id}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error('Failed to fetch notifications:', err));
    } catch (error) {
      console.error("Invalid token", error);
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <div className="header-left">
          <p className="booking-application-text">Booking Application</p>
        </div>
        <div className="header-center">
          <img
            src={vitalcarelogo}
            alt="VitalCare Logo"
            className="my-account-logo"
          />
        </div>
        <div className="header-right">
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      <nav className="my-account-nav">
        <button className="nav-button" onClick={() => navigate('/my-account')}>
          My Account
        </button>
        <button className="nav-button" onClick={() => navigate('/contact-us2')}>
          Contact Us
        </button>
        <button className="nav-button active">Notifications</button>
      </nav>

      <h2 className="notifications-title">Notifications for {username}</h2>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p style={{ marginTop: '20px' }}>No notifications.</p>
        ) : (
          notifications.map(note => (
            <div className="notification-card" key={note.notification_id}>
              <p className="notification-message">{note.message}</p>
              <p className="notification-date">
                {new Date(note.date).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
