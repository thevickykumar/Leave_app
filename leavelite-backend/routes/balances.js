const express = require('express');
const router = express.Router();
const { pool } = require('../db');


router.get('/mine', async (req, res) => {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT type, balance FROM leave_balances WHERE user_id = ? ORDER BY type', [userId]);
    res.json(rows);
});


module.exports = router;