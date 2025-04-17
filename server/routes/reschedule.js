const express = require('express');
const router = express.Router();
const db = require('../db');

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { availabilityId } = req.body;

  try {
    const availability = await db.query('SELECT Date FROM Availability WHERE Availability_ID = $1', [availabilityId]);

    await db.query(`UPDATE Appointments SET Date = $1, Status = 'Rescheduled' WHERE Appointment_ID = $2`, [
      availability.rows[0].date,
      id,
    ]);

    await db.query(`UPDATE Availability SET Status = 'Booked' WHERE Availability_ID = $1`, [availabilityId]);

    res.status(200).json({ message: 'Rescheduled successfully' });
  } catch (err) {
    console.error('Reschedule error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
