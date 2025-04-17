const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { patientId, therapistId, availabilityId } = req.body;
  
    try {
      // Get date from availability row
      const availabilityRes = await db.query(
        `SELECT Date FROM Availability WHERE Availability_ID = $1`,
        [availabilityId]
      );
  
      const date = availabilityRes.rows[0].date;
  
      // Insert appointment
      await db.query(
        `INSERT INTO Appointments (Patient_ID, Therapist_ID, Session_Type_ID, Status, Date)
         VALUES ($1, $2, 1, 'Scheduled', $3)`, // assuming Session_Type_ID = 1
        [patientId, therapistId, date]
      );
  
      // Mark availability as Booked
      await db.query(
        `UPDATE Availability SET Status = 'Booked' WHERE Availability_ID = $1`,
        [availabilityId]
      );
  
      res.status(200).json({ message: 'Appointment booked' });
    } catch (err) {
      console.error('Booking error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
module.exports = router;