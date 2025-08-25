const express = require('express');
const cors = require('cors');
require('dotenv').config();


const { requireAuth } = require('./middleware/auth');


const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));


app.get('/', (_, res) => res.send('LeaveLite API running'));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/leave', requireAuth, require('./routes/leave'));
app.use('/api/balances', requireAuth, require('./routes/balances'));
app.use('/api/users', requireAuth, require('./routes/users'));


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));