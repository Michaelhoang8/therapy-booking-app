const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM Session_Types ORDER BY Title`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching session types:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
