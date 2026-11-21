const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { patientId, therapistId, availabilityId, sessionTypeId } = req.body;

  try {
    // Fetch the availability, session type, and therapist details in parallel
    const [availabilityRes, sessionTypeRes, therapistRes] = await Promise.all([
      db.query(
        `SELECT Date, Start_Time FROM Availability WHERE Availability_ID = $1`,
        [availabilityId]
      ),
      db.query(
        `SELECT Title FROM Session_Types WHERE Session_Type_ID = $1`,
        [sessionTypeId]
      ),
      db.query(
        `SELECT u.Name AS therapist_name
           FROM Therapists t
           JOIN Users u ON t.User_ID = u.User_ID
          WHERE t.Therapist_ID = $1`,
        [therapistId]
      )
    ]);

    // Validate fetched data
    if (
      availabilityRes.rows.length === 0 ||
      sessionTypeRes.rows.length === 0 ||
      therapistRes.rows.length === 0
    ) {
      return res.status(404).json({ message: 'Required data not found' });
    }

    // Combine date and start_time into a full timestamp
    const availDate = availabilityRes.rows[0].date; // JS Date
    const startTime = availabilityRes.rows[0].start_time; // "HH:MM:SS"
    const [hours, minutes, seconds] = startTime.split(':').map(Number);
    const appointmentDate = new Date(availDate);
    appointmentDate.setHours(hours, minutes, seconds, 0);

    const sessionTitle = sessionTypeRes.rows[0].title;
    const therapistName = therapistRes.rows[0].therapist_name;

    // Insert the appointment with the correct timestamp
    await db.query(
      `INSERT INTO Appointments (Patient_ID, Therapist_ID, Session_Type_ID, Status, Date)
       VALUES ($1, $2, $3, 'Scheduled', $4)`,
      [patientId, therapistId, sessionTypeId, appointmentDate]
    );

    // Mark availability as booked
    await db.query(
      `UPDATE Availability SET Status = 'Booked' WHERE Availability_ID = $1`,
      [availabilityId]
    );

    // Format for notification message
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
    const message = `You have successfully booked a ${sessionTitle} appointment at ${formattedTime} on ${formattedDate} with ${therapistName}.`;

    // Insert notification
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
