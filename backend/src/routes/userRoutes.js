const express = require('express');
const { createUserController } = require('../controllers/userController');

function createUserRoutes(authService, authenticateToken) {
  const router = express.Router();
  const controller = createUserController(authService);

  router.get('/profile', authenticateToken, controller.profile);

  return router;
}

module.exports = { createUserRoutes };