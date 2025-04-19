const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:therapistId', async (req, res) => {
    const { therapistId } = req.params;
  
    try {
      const result = await db.query(`
        SELECT * FROM Availability
        WHERE Therapist_ID = $1 AND Status = 'Available'
        ORDER BY Date, Start_Time
      `, [therapistId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch availability' });
    }
  });
  
module.exports = router;