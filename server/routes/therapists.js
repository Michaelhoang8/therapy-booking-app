// server/routes/therapists.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/therapists
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        t.Therapist_ID      AS therapist_id,
        u.Name              AS name,
        u.Email             AS email,
        u.Phone_Number      AS phone_number,
        t.Speciality        AS speciality
      FROM Therapists t
      JOIN Users u 
        ON t.User_ID = u.User_ID
      ORDER BY u.Name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch therapists', err);
    res.status(500).json({ error: 'Failed to fetch therapists' });
  }
});

// GET /api/therapists/:therapistId/appointments
// Optional ?status=Scheduled|Completed|Cancelled
router.get('/:therapistId/appointments', async (req, res) => {
  const { therapistId } = req.params;
  const { status }      = req.query;

  try {
    let sql = `
      SELECT
        a.Appointment_ID    AS appointment_id,
        a.Date              AS date,
        a.Status            AS status,
        u.Name              AS patient_name,
        st.Title            AS session_type
      FROM Appointments a
      JOIN Patients p       ON a.Patient_ID      = p.Patient_ID
      JOIN Users u          ON p.User_ID         = u.User_ID
      JOIN Session_Types st ON a.Session_Type_ID = st.Session_Type_ID
      WHERE a.Therapist_ID = $1
    `;
    const params = [therapistId];

    if (status) {
      sql += ` AND a.Status = $2`;
      params.push(status);
    }

    sql += ` ORDER BY a.Date ASC`;

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching therapist appointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
