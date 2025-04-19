const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      `SELECT * FROM Users 
       WHERE (name = $1 OR email = $1) 
       AND password = $2`,
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      const token = jwt.sign(
        { id: user.user_id, username: user.name, role: user.role },
        SECRET_KEY,
        { expiresIn: '2h' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          id: user.user_id,
          username: user.name,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
