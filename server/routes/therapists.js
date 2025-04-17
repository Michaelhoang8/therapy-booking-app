const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/therapists
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
  
module.exports = router;