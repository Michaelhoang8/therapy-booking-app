const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { patientId, therapistId, availabilityId, sessionTypeId } = req.body;

  try {
    // Get date from availability row
    const availabilityRes = await db.query(
      `SELECT Date FROM Availability WHERE Availability_ID = $1`,
      [availabilityId]
    );

    if (availabilityRes.rows.length === 0) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    const date = availabilityRes.rows[0].date;

    // Insert appointment
    await db.query(
      `INSERT INTO Appointments (Patient_ID, Therapist_ID, Session_Type_ID, Status, Date)
       VALUES ($1, $2, $3, 'Scheduled', $4)`,
      [patientId, therapistId, sessionTypeId, date]
    );

    // Mark availability as Booked
    await db.query(
      `UPDATE Availability SET Status = 'Booked' WHERE Availability_ID = $1`,
      [availabilityId]
    );

    // Add notification
    const message = 'You have successfully booked an appointment on ' + new Date(date).toLocaleDateString();
    await db.query(
      `INSERT INTO Notifications (User_ID, Message) VALUES ($1, $2)`,
      [patientId, message]
    );

    res.status(200).json({ message: 'Appointment booked and notification added' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
  
  
module.exports = router;