const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { patientId } = req.query;

  try {
    const result = await db.query(
      `
      SELECT 
        a.Appointment_ID,
        a.Date,
        u.Name AS Doctor,
        st.Title AS Concern,
        t.Therapist_ID AS therapist_id
      FROM Appointments a
      JOIN Therapists t ON a.Therapist_ID = t.Therapist_ID
      JOIN Users u ON t.User_ID = u.User_ID
      JOIN Session_Types st ON a.Session_Type_ID = st.Session_Type_ID
      WHERE a.Patient_ID = $1 AND (a.Status = 'Scheduled' OR a.Status = 'Rescheduled')
      ORDER BY a.Date ASC
      `,
      [patientId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("🔥 DB Query Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
