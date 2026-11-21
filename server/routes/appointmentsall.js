// server/routes/appointmentsall.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/appointmentsall
// Returns all appointments (for admin)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        a.Appointment_ID      AS appointment_id,
        a.Date                AS date,
        a.Status              AS status,

        -- patient info
        p.Patient_ID          AS patient_id,
        uP.Name               AS patient_name,
        uP.Email              AS patient_email,
        uP.Phone_Number       AS patient_phone,

        -- therapist info
        t.Therapist_ID        AS therapist_id,
        uT.Name               AS therapist_name,
        uT.Email              AS therapist_email,
        uT.Phone_Number       AS therapist_phone,

        -- session type
        st.Session_Type_ID    AS session_type_id,
        st.Title              AS session_type
      FROM Appointments a
      JOIN Patients p       ON a.Patient_ID    = p.Patient_ID
      JOIN Users uP         ON p.User_ID       = uP.User_ID
      JOIN Therapists t     ON a.Therapist_ID  = t.Therapist_ID
      JOIN Users uT         ON t.User_ID       = uT.User_ID
      JOIN Session_Types st ON a.Session_Type_ID = st.Session_Type_ID
      ORDER BY a.Date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch all appointments', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
