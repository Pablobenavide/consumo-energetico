const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { swaggerDocument } = require('./config/swagger');
const { createPool } = require('./config/database');
const { createApiRoutes } = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { createAuthMiddleware } = require('./middlewares/auth');
const { buildRepositories } = require('./repositories');
const { buildServices } = require('./services');

function createApp(options = {}) {
  const useMemory = options.useMemory ?? (!options.pool && !options.useDatabase);
  const pool = options.pool || (!useMemory ? createPool() : null);
  const repositories = options.repositories || buildRepositories({ pool, useMemory });
  const services = options.services || buildServices(repositories, {
    jwtSecret: options.jwtSecret,
    bcryptRounds: options.bcryptRounds,
  });
  const authenticateToken = options.authenticateToken || createAuthMiddleware(options.jwtSecret || 'energyhome-secret');

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api', createApiRoutes({ ...services, authenticateToken }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };