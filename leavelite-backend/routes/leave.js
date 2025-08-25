const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireManager } = require('../middleware/auth');


function daysInclusive(a, b) {
    const d1 = new Date(a), d2 = new Date(b);
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
}


// Create leave request
router.post('/', async (req, res) => {
    const { type, start, end, reason } = req.body;
    if (!type || !start || !end) return res.status(400).json({ error: 'Missing fields' });
    const days = daysInclusive(start, end);
    if (days <= 0) return res.status(400).json({ error: 'End date must be >= start date' });


    try {
        const [r] = await pool.query(
            'INSERT INTO leave_requests(employee_id,type,start_date,end_date,days,reason,status) VALUES (?,?,?,?,?,? ,"Pending")',
            [req.user.id, type, start, end, days, reason || null]
        );
        res.json({ id: r.insertId });
    } catch (e) {
        res.status(500).json({ error: 'Failed to submit request' });
    }
});

// My leave requests
router.get('/mine', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
});


// Manager: pending for my team
router.get('/pending', requireManager, async (req, res) => {
    const [rows] = await pool.query(
        `SELECT lr.*, u.name AS employee_name
FROM leave_requests lr
JOIN users u ON u.id = lr.employee_id
WHERE u.manager_id = ? AND lr.status = 'Pending'
ORDER BY lr.created_at ASC`,
        [req.user.id]
    );
    res.json(rows);
});


// Manager decision: approve or reject
router.post('/:id/decision', requireManager, async (req, res) => {
    const { status, comment } = req.body; // 'Approved' or 'Rejected'
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });


    const [[reqRow]] = await pool.query(
        `SELECT lr.* FROM leave_requests lr
JOIN users u ON u.id = lr.employee_id
WHERE lr.id=? AND u.manager_id=?`,
        [req.params.id, req.user.id]
    );
    if (!reqRow) return res.status(404).json({ error: 'Request not found' });
    if (reqRow.status !== 'Pending') return res.status(400).json({ error: 'Already decided' });


    await pool.query('UPDATE leave_requests SET status=?, manager_id=?, manager_comment=?, decided_at=NOW() WHERE id=?',
        [status, req.user.id, comment || null, req.params.id]
    );


    if (status === 'Approved') {
        // deduct balance
        await pool.query(
            'UPDATE leave_balances SET balance = GREATEST(0, balance - ?) WHERE user_id=? AND type=?',
            [reqRow.days, reqRow.employee_id, reqRow.type]
        );
    }


    res.json({ ok: true });
});


// Calendar: approved leaves (optionally by month)
router.get('/calendar', async (req, res) => {
    const { month } = req.query; // YYYY-MM
    let sql = `SELECT lr.*, u.name AS employee_name FROM leave_requests lr JOIN users u ON u.id=lr.employee_id WHERE lr.status='Approved'`;
    const params = [];
    if (month) {
        sql += ' AND DATE_FORMAT(lr.start_date, "%Y-%m") <= ? AND DATE_FORMAT(lr.end_date, "%Y-%m") >= ?';
        params.push(month, month);
    }
    sql += ' ORDER BY lr.start_date ASC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
});


module.exports = router;