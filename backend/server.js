const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const noteRoutes = require('./routes/noteRoutes');
require('dotenv').config();

const logger = require('./utils/logger');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger })); // logs every HTTP request/response

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    logger.error({ err }, 'Database test query failed');
    res.status(500).json({ success: false, error: err.message });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));