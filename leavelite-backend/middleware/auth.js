const jwt = require('jsonwebtoken');


function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, role }
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}


function requireManager(req, res, next) {
    if (req.user?.role !== 'manager') return res.status(403).json({ error: 'Manager only' });
    next();
}


module.exports = { requireAuth, requireManager };