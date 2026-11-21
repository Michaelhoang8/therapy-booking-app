// client/src/Pages/LandingPage.js
import React, { useState } from "react";
import axios from "axios";
import '../Styles/LandingPage.css';
import VitalCareLogo from '../VitalCare.png';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { username, password }
      );

      const { success, token, role, user, patientId, therapistId } = response.data;
      if (!success) {
        setError("Invalid username or password");
        return;
      }

      // store everything we need
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('username', user.username);
      if (patientId !== null)   localStorage.setItem('patientId', patientId);
      if (therapistId !== null) localStorage.setItem('therapistId', therapistId);
      
      if (role === 'Therapist') {
        // also store therapistId if you returned it:
        if (response.data.therapistId) {
          localStorage.setItem('therapistId', response.data.therapistId);
        }
        navigate('/therapist');
      } else if (role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/my-account');
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  const handleContactClick = () => {
    navigate('/contact-us');
  };

  return (
    <div className="landing-page-container">
      <header className="landing-header">
        <img
          src={VitalCareLogo}
          alt="VitalCare Logo"
          className="landing-logo"
        />
        <p className="landing-description">Booking Application</p>
      </header>

      <nav className="landing-nav">
        <button className="nav-button active">My Account</button>
        <button className="nav-button" onClick={handleContactClick}>
          Contact Us
        </button>
      </nav>

      <main className="landing-main">
        <h2 className="login-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </main>
    </div>
  );
}

export default LandingPage;
