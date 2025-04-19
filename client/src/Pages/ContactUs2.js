import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Styles/ContactUs.css';
import vitalcarelogo from '../VitalCare.png'; // Import the logo

function ContactUs() {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="contact-us-container">
      <header className="contact-us-header">
          <img
            src={vitalcarelogo}
            alt="VitalCare Logo"
            className="contact-us-logo"
          />
        <p className="contact-us-description">Booking Application</p>
      </header>

      <nav className="contact-us-nav">
        <button className="nav-button" onClick={() => navigate('/my-account')}>
          My Account
        </button>
        <button className="nav-button active">Contact Us</button>
      </nav>

      <main className="contact-us-main">
        <h2 className="contact-us-title">Contact Us</h2>
        <div className="contact-us-details">
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
              420 Airdrie St NW #360
              <br />
              Calgary, Alberta
              <br />
              Canada T8H 9P9
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactUs;