  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const morgan = require('morgan');
  const mongoSanitize = require('express-mongo-sanitize');

  const apiRoutes = require('./routes');
  const { notFound, errorHandler } = require('./middleware/errorHandler');
  const { apiLimiter } = require('./middleware/rateLimiter');

  const app = express();

  // --- Security & core middleware -------------------------------------------------
  app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman/server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(mongoSanitize());

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  app.use('/api', apiLimiter);

  // --- Routes -----------------------------------------------------------------------
  app.get('/', (req, res) => {
    res.json({ success: true, message: 'POS backend API running', baseUrl: '/api' });
  });

  app.use('/api', apiRoutes);

  // --- 404 + centralized error handling ---------------------------------------------
  app.use(notFound);
  app.use(errorHandler);

  module.exports = app;
