const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { patientId } = req.query; // this is actually User_ID

  try {
    // Convert User_ID to Patient_ID
    const patientRes = await db.query(
      'SELECT Patient_ID FROM Patients WHERE User_ID = $1',
      [patientId]
    );

    if (patientRes.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const actualPatientId = patientRes.rows[0].patient_id;

    // Now fetch completed appointments
    const result = await db.query(`
      SELECT DISTINCT t.Therapist_ID, u.Name
      FROM Appointments a
      JOIN Therapists t ON a.Therapist_ID = t.Therapist_ID
      JOIN Users u ON t.User_ID = u.User_ID
      WHERE a.Patient_ID = $1 AND a.Status = 'Completed'
    `, [actualPatientId]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching completed doctors:", err);
    res.status(500).json({ message: 'Server error fetching doctors' });
  }
});

module.exports = router;
