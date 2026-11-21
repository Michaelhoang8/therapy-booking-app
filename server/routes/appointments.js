// server/routes/appointments.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET upcoming appointments for a patient
// e.g. GET /api/appointments?patientId=123
router.get('/', async (req, res) => {
  const { patientId } = req.query;

  try {
    const result = await db.query(
      `
      SELECT 
        a.Appointment_ID    AS appointment_id,
        a.Date              AS date,
        u.Name              AS doctor,
        st.Title            AS concern,
        t.Therapist_ID      AS therapist_id,
        a.Status            AS status
      FROM Appointments a
      JOIN Therapists t ON a.Therapist_ID = t.Therapist_ID
      JOIN Users u       ON t.User_ID        = u.User_ID
      JOIN Session_Types st ON a.Session_Type_ID = st.Session_Type_ID
      WHERE a.Patient_ID = $1
        AND (a.Status = 'Scheduled' OR a.Status = 'Rescheduled')
      ORDER BY a.Date ASC
      `,
      [patientId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('🔥 DB Query Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/appointments/:id/status
// Body: { status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' }
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      `UPDATE Appointments
         SET Status = $1
       WHERE Appointment_ID = $2`,
      [status, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update appointment status', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
