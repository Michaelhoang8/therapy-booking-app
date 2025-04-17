const express = require('express');
const router = express.Router();
const db = require('../db');

// cancel appointment
router.patch('/:id/cancel', async (req, res) => {
    const { id } = req.params;
    try {
      await db.query(
        `UPDATE Appointments SET Status = 'Cancelled' WHERE Appointment_ID = $1`,
        [id]
      );
      res.status(200).json({ message: 'Appointment cancelled' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error cancelling appointment' });
    }
  });

module.exports = router;
