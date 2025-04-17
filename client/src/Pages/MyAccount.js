import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../Styles/MyAccount.css';
import vitalcarelogo from "../VitalCare.png";

function MyAccount() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); 
        setUsername(decoded.username);
      } catch (error) {
        console.error("Invalid token", error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);


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
        <button className="nav-button active">My Account</button>
        <button className="nav-button" onClick={() => navigate('/contact-us2')}>
          Contact Us
        </button>
      </nav>

      <main className="my-account-main">
        <h2 className="welcome-text">Hello, {username}!</h2>
        <p className="instruction-text">How would you like to proceed?</p>
        <div className="button-container">
          <button
            className="my-account-button"
            onClick={() => navigate('/book-appointment')}
          >
            Book Appointment
          </button>
          <button
            className="my-account-button"
            onClick={() => navigate('/manage-appointment')}
          >
            Manage Appointments
          </button>
        </div>
      </main>
    </div>
  );
}

export default MyAccount;
