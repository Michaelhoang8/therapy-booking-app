import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/ViewReviews.css';
import logo from '../VitalCare.png';

function ViewReviews() {
  const navigate = useNavigate();
  const location = useLocation();
  const therapistId = location.state?.therapistId;

  const [reviews, setReviews] = useState([]);
  const [therapistName, setTherapistName] = useState('');

  useEffect(() => {
    if (!therapistId) {
      navigate('/book-appointment');
      return;
    }

    axios.get(`http://localhost:5000/api/therapists/${therapistId}`)
      .then(res => setTherapistName(res.data.name))
      .catch(() => setTherapistName('Therapist'));

    axios.get(`http://localhost:5000/api/reviews/therapist/${therapistId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('Failed to load reviews:', err));
  }, [therapistId, navigate]);

  return (
    <div className="book-container">
      <header className="book-header">
        <button className="main-button" onClick={() => navigate('/book-appointment')}>Back</button>
        <img src={logo} alt="Logo" className="logo" />
      </header>

      <h2 className="booking-title">Reviews for {therapistName}</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
  <div key={review.review_id} className="review-card">
    <div className="stars">
      {'★'.repeat(review.rating)}
      {'☆'.repeat(5 - review.rating)}
    </div>
    <p className="comment">{review.comments || 'No comment provided.'}</p>
    <p className="review-author"><strong>Reviewed by:</strong> {review.reviewer_name}</p>
    <p className="review-date">
      {new Date(review.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      })}
    </p>
  </div>
))}

        </div>
      )}
    </div>
  );
}

export default ViewReviews;
