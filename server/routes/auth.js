const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      `SELECT * FROM Users 
       WHERE (name = $1 OR email = $1) 
       AND password = $2`,
      [username, password]
    );

    res.json({ exists: result.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;