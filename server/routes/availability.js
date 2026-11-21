// server/routes/availability.js

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// Create a new availability slot
// POST /api/availability
// Expected JSON body:
// {
//   "Therapist_ID": 1,
//   "Date": "2025-05-10",
//   "Start_Time": "14:00:00",
//   "End_Time": "16:00:00",
//   "Status": "Available"
// }
router.post('/', async (req, res) => {
  const { Therapist_ID, Date, Start_Time, End_Time, Status } = req.body;
  try {
    await db.query(
      `INSERT INTO Availability
         (Therapist_ID, Date, Start_Time, End_Time, Status)
       VALUES ($1, $2, $3, $4, $5)`,
      [Therapist_ID, Date, Start_Time, End_Time, Status]
    );
    res.status(201).json({ message: 'Availability slot created' });
  } catch (err) {
    console.error('Error inserting availability:', err);
    res.status(500).json({ error: 'Failed to add availability' });
  }
});

// Fetch all available slots for a therapist
// GET /api/availability/:therapistId
router.get('/:therapistId', async (req, res) => {
  const { therapistId } = req.params;
  try {
    const result = await db.query(
      `SELECT *
         FROM Availability
        WHERE Therapist_ID = $1
          AND Status = 'Available'
        ORDER BY Date, Start_Time`,
      [therapistId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

module.exports = router;
