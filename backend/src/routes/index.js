const express = require('express');
const { createAuthRoutes } = require('./authRoutes');
const { createUserRoutes } = require('./userRoutes');
const { createApplianceRoutes } = require('./applianceRoutes');
const { createConsumptionRoutes } = require('./consumptionRoutes');
const { createRecommendationRoutes } = require('./recommendationRoutes');

function createApiRoutes({ authService, applianceService, consumptionService, recommendationService, authenticateToken }) {
  const router = express.Router();

  router.use('/auth', createAuthRoutes(authService));
  router.use('/users', createUserRoutes(authService, authenticateToken));
  router.use('/appliances', createApplianceRoutes(applianceService, authenticateToken));
  router.use('/consumption', createConsumptionRoutes(consumptionService, authenticateToken));
  router.use('/recommendations', createRecommendationRoutes(consumptionService, recommendationService, authenticateToken));

  return router;
}

module.exports = { createApiRoutes };