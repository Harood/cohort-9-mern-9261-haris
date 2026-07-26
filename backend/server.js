const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const noteRoutes = require('./routes/noteRoutes');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET is not set. Exiting.');
  process.exit(1);
}

const logger = require('./utils/logger');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger })); // logs every HTTP request/response

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/test-db', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    next(err); // let the global error handler deal with it — no raw err.message sent to client
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));