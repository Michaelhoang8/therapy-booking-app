const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
      const result = await db.query(`
        SELECT t.Therapist_ID, u.Name
        FROM Therapists t
        JOIN Users u ON t.User_ID = u.User_ID
      `);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch therapists' });
    }
  });

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT u.Name
      FROM Therapists t
      JOIN Users u ON t.User_ID = u.User_ID
      WHERE t.Therapist_ID = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    res.json({ name: result.rows[0].name });
  } catch (err) {
    console.error("Error fetching therapist name:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

  
module.exports = router;