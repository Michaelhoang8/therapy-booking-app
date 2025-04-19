import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../Styles/ManageReviews.css';
import logo from '../VitalCare.png';

function ManageReviews() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');
  
    const decoded = jwtDecode(token);
    console.log("🔍 Decoded token:", decoded);
  
    setPatientId(decoded.id);
  
    axios.get(`http://localhost:5000/api/completeddoctors?patientId=${decoded.id}`)
      .then(res => {
        console.log("🩺 Doctors received:", res.data);
        setDoctors(res.data);
      })
      .catch(err => {
        console.error('❌ Failed to fetch doctors:', err);
      });
  }, []);
  

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        patientId,
        therapistId: selectedDoctorId,
        rating,
        comments: comment
      });
      alert("Review submitted!");
      setSelectedDoctorId('');
      setRating(0);
      setComment('');
      setConfirmed(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="book-container">
      <header className="book-header">
        <button className="main-button" onClick={() => navigate('/my-account')}>Main</button>
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <h2 className="booking-title">Manage Reviews</h2>

      <select
        className="dropdown"
        value={selectedDoctorId}
        onChange={(e) => setSelectedDoctorId(e.target.value)}
      >
        <option value="">Select a doctor</option>
        {doctors.map(doc => (
          <option key={doc.therapist_id} value={doc.therapist_id}>
            {doc.name}
          </option>
        ))}
      </select>

      {selectedDoctorId && (
        <div className="review-section">
          <div className="star-selector">
            <p>Select Rating:</p>
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                className={`star ${rating >= num ? 'selected-star' : ''}`}
                onClick={() => {
                  setRating(num);
                  setConfirmed(true);
                }}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className="comment-box"
            rows={4}
            placeholder="Leave your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {confirmed && (
            <button className="confirm-btn" onClick={handleSubmit}>
              Submit Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ManageReviews;
