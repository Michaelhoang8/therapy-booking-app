const express = require('express');
const router = express.Router();
const db = require('../db');

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

    const therapistRes = await db.query(`
      SELECT u.Name 
      FROM Therapists t 
      JOIN Users u ON t.User_ID = u.User_ID 
      WHERE t.Therapist_ID = $1
    `, [therapistId]);

    const doctorName = therapistRes.rows[0]?.name || "your therapist";

    const message = `You have posted a review giving ${rating} star${rating > 1 ? 's' : ''} to ${doctorName}.`;

    await db.query(`
      INSERT INTO Notifications (User_ID, Message)
      VALUES ($1, $2)
    `, [patientId, message]);

    res.status(201).json({ message: 'Review submitted and notification created' });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ message: 'Server error submitting review' });
  }
});

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
