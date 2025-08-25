const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');


router.post('/login', async (req, res) => {
    const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
    const parse = schema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
    const { email, password } = parse.data;


    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });


    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });


    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});


router.get('/me', async (req, res) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(200).json({ user: null });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await pool.query('SELECT id,name,email,role,manager_id FROM users WHERE id=?', [payload.id]);
        res.json({ user: rows[0] || null });
    } catch {
        res.json({ user: null });
    }
});


module.exports = router;