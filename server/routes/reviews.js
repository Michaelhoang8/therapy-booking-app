const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/reviews
 * Body: { patientId, therapistId, rating, comments }
 */
router.post('/', async (req, res) => {
  const { patientId, therapistId, rating, comments } = req.body;

  if (!patientId || !therapistId || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await db.query(`
      INSERT INTO Reviews (Patient_ID, Therapist_ID, Rating, Comments)
      VALUES ($1, $2, $3, $4)
    `, [patientId, therapistId, rating, comments]);

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ message: 'Server error submitting review' });
  }
});

// GET /api/reviews/therapist/:id
router.get('/therapist/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT 
        r.Review_ID,
        r.Rating,
        r.Comments,
        r.Date,
        u.Name AS reviewer_name
      FROM Reviews r
      JOIN Patients p ON r.Patient_ID = p.Patient_ID
      JOIN Users u ON p.User_ID = u.User_ID
      WHERE r.Therapist_ID = $1
      ORDER BY r.Date DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

module.exports = router;
