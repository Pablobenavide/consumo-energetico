const express = require('express');
const { createRecommendationController } = require('../controllers/recommendationController');

function createRecommendationRoutes(consumptionService, recommendationService, authenticateToken) {
  const router = express.Router();
  const controller = createRecommendationController(consumptionService, recommendationService);

  router.get('/', authenticateToken, controller.list);

  return router;
}

module.exports = { createRecommendationRoutes };