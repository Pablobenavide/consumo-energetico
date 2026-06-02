const express = require('express');
const { createConsumptionController } = require('../controllers/consumptionController');

function createConsumptionRoutes(consumptionService, authenticateToken) {
  const router = express.Router();
  const controller = createConsumptionController(consumptionService);

  router.get('/', authenticateToken, controller.list);
  router.get('/summary', authenticateToken, controller.summary);

  return router;
}

module.exports = { createConsumptionRoutes };