const express = require('express');
const router = express.Router();
const jwt    = require('jsonwebtoken');
const db     = require('../db');
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1) fetch the user
    const result = await db.query(
      `SELECT * FROM Users 
       WHERE (name = $1 OR email = $1)
         AND password = $2`,
      [username, password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const user = result.rows[0];

    // 2) if Therapist, fetch therapistId
    let therapistId = null;
    if (user.role === 'Therapist') {
      const tidRes = await db.query(
        `SELECT Therapist_ID 
           FROM Therapists 
          WHERE User_ID = $1`,
        [user.user_id]
      );
      therapistId = tidRes.rows[0]?.therapist_id || null;
    }

    // 3) if Patient, fetch patientId
    let patientId = null;
    if (user.role === 'Patient') {
      const pidRes = await db.query(
        `SELECT Patient_ID 
           FROM Patients 
          WHERE User_ID = $1`,
        [user.user_id]
      );
      patientId = pidRes.rows[0]?.patient_id || null;
    }

    // 4) sign the JWT
    const token = jwt.sign(
      { id: user.user_id, username: user.name },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    // 5) respond with role, user info, plus any IDs
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      role: user.role,
      user: {
        id: user.user_id,
        username: user.name
      },
      therapistId,
      patientId
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
