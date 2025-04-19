const express = require('express');
const router = express.Router();
const db = require('../db');

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { availabilityId } = req.body;

  try {
    const availabilityRes = await db.query(
      `SELECT Date, Start_Time FROM Availability WHERE Availability_ID = $1`,
      [availabilityId]
    );

    if (availabilityRes.rows.length === 0) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    const newDate = availabilityRes.rows[0].date;
    const newTime = availabilityRes.rows[0].start_time;

    await db.query(
      `UPDATE Appointments SET Date = $1, Status = 'Rescheduled' WHERE Appointment_ID = $2`,
      [newDate, id]
    );

    await db.query(
      `UPDATE Availability SET Status = 'Booked' WHERE Availability_ID = $1`,
      [availabilityId]
    );

    const appointmentRes = await db.query(
      `SELECT Patient_ID, Therapist_ID, Session_Type_ID FROM Appointments WHERE Appointment_ID = $1`,
      [id]
    );

    const { patient_id, therapist_id, session_type_id } = appointmentRes.rows[0];

    const [doctorRes, sessionRes] = await Promise.all([
      db.query(`
        SELECT u.Name AS doctor_name
        FROM Therapists t
        JOIN Users u ON t.User_ID = u.User_ID
        WHERE t.Therapist_ID = $1
      `, [therapist_id]),

      db.query(`SELECT Title FROM Session_Types WHERE Session_Type_ID = $1`, [session_type_id])
    ]);

    const doctorName = doctorRes.rows[0].doctor_name;
    const sessionTitle = sessionRes.rows[0].title;

    const formattedTime = new Date(`${newDate.toDateString()} ${newTime}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const formattedDate = new Date(newDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const message = `You have successfully rescheduled your ${sessionTitle} appointment to ${formattedTime} on ${formattedDate} with ${doctorName}.`;

    await db.query(
      `INSERT INTO Notifications (User_ID, Message) VALUES ($1, $2)`,
      [patient_id, message]
    );

    res.status(200).json({ message: 'Rescheduled successfully and notification sent' });
  } catch (err) {
    console.error('Reschedule error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;