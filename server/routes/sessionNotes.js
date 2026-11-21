const express = require('express');
const router  = express.Router();
const db      = require('../db');

// POST /api/session-notes
// Body: { appointmentId: number, therapistNotes: string }
router.post('/', async (req, res) => {
  const { appointmentId, therapistNotes } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO Session_Notes
         (Appointment_ID, Therapist_Notes, Status)
       VALUES ($1, $2, 'Completed')
       RETURNING Note_ID, Appointment_ID, Therapist_Notes, Date`,
      [appointmentId, therapistNotes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving session note:', err);
    res.status(500).json({ error: 'Failed to save session note' });
  }
});

// GET /api/session-notes/:appointmentId
// Returns the most recent note for that appointment
router.get('/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const result = await db.query(
      `SELECT Therapist_Notes AS therapist_notes, Date
         FROM Session_Notes
        WHERE Appointment_ID = $1
        ORDER BY Date DESC
        LIMIT 1`,
      [appointmentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No notes found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching session note:', err);
    res.status(500).json({ error: 'Failed to fetch session note' });
  }
});

module.exports = router;
