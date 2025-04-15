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
    setError(""); // Clear previous errors
    
    try {
      // Send credentials to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      if (response.data.exists) {
        navigate('/my-account');
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server");
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
        <h2 className="login-title">Patient Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="Username"
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