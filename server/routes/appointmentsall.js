const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all appointments for a patient
router.get('/', async (req, res) => {
    const { patientId } = req.query;
  
    try {
      const result = await db.query(
        `
        SELECT 
          a.Appointment_ID,
          a.Date,
          t.Therapist_ID AS therapist_id,
          t.Name AS Doctor,
          st.Title AS Concern
        FROM Appointments a
        JOIN Therapists t ON a.Therapist_ID = t.Therapist_ID
        JOIN Session_Types st ON a.Session_Type_ID = st.Session_Type_ID
        WHERE a.Patient_ID = $1
        ORDER BY a.Date ASC
        `,
        [patientId]
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
