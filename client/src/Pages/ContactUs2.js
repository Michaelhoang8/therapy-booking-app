import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/MyAccount.css';
import vitalcarelogo from '../VitalCare.png';

function ContactUs2() {
  const navigate = useNavigate();

  return (
    <div className="my-account-container">
      <header className="my-account-header">
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
        <button className="nav-button active">Contact Us</button>
        <button className="nav-button" onClick={() => navigate('/notifications')}>
          Notifications
        </button>
      </nav>

      <main className="my-account-main">
        <h2 className="welcome-text">Contact Us</h2>
        <div className="button-container">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <p className="contact-info">vitalcare@gmail.com</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <p className="contact-info">(403) - 888 - 8888</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <p className="contact-info">
              420 Airdrie St NW #360<br />
              Calgary, Alberta<br />
              Canada T8H 9P9
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactUs2;