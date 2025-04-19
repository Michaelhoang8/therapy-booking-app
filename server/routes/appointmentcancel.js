const express = require('express');
const router = express.Router();
const db = require('../db');

router.patch('/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT 
        a.Patient_ID,
        a.Date,
        s.Title AS session_title,
        u.Name AS doctor_name
      FROM Appointments a
      JOIN Session_Types s ON a.Session_Type_ID = s.Session_Type_ID
      JOIN Therapists t ON a.Therapist_ID = t.Therapist_ID
      JOIN Users u ON t.User_ID = u.User_ID
      WHERE a.Appointment_ID = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { patient_id, date, session_title, doctor_name } = result.rows[0];

    await db.query(
      `UPDATE Appointments SET Status = 'Cancelled' WHERE Appointment_ID = $1`,
      [id]
    );

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const formattedTime = new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const message = `You have cancelled your ${session_title} appointment with ${doctor_name} scheduled for ${formattedDate} at ${formattedTime}.`;

    await db.query(
      `INSERT INTO Notifications (User_ID, Message) VALUES ($1, $2)`,
      [patient_id, message]
    );

    res.status(200).json({ message: 'Appointment cancelled and notification created' });

  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

module.exports = router;

