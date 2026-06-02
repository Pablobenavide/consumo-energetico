const express = require('express');
const { createApplianceController } = require('../controllers/applianceController');

function createApplianceRoutes(applianceService, authenticateToken) {
  const router = express.Router();
  const controller = createApplianceController(applianceService);

  router.use(authenticateToken);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}

module.exports = { createApplianceRoutes };