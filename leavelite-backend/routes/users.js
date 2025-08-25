const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireManager } = require('../middleware/auth');
const bcrypt = require('bcryptjs');


// Manager: list employees reporting to me
router.get('/employees', requireManager, async (req, res) => {
    const [rows] = await pool.query('SELECT id,name,email,role FROM users WHERE manager_id = ?', [req.user.id]);
    res.json(rows);
});


// Manager: create a new user
router.post('/', requireManager, async (req, res) => {
    const { name, email, password, role = 'employee' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const hash = await bcrypt.hash(password, 10);
    try {
        const [r] = await pool.query(
            'INSERT INTO users(name,email,password_hash,role,manager_id) VALUES (?,?,?,?,?)',
            [name, email, hash, role, role === 'employee' ? req.user.id : null]
        );
        // seed default balances
        await pool.query(
            'INSERT INTO leave_balances(user_id,type,balance) VALUES (?,?,?),(?,?,?),(?,?,?)',
            [r.insertId, 'Vacation', 15, r.insertId, 'Sick', 8, r.insertId, 'Unpaid', 999]
        );
        res.json({ id: r.insertId });
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email exists' });
        res.status(500).json({ error: 'Failed to create user' });
    }
});


module.exports = router;