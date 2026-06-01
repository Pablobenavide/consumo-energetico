const { AuthError } = require('../utils/errors');
const { verifyToken } = require('../utils/jwt');

function createAuthMiddleware(jwtSecret) {
  return function authenticateToken(req, _res, next) {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');

    if (!token) {
      return next(new AuthError('Se requiere un token de acceso'));
    }

    try {
      const decoded = verifyToken(token, jwtSecret);
      req.user = {
        id: Number(decoded.sub),
        email: decoded.email,
        name: decoded.name,
      };
      return next();
    } catch (error) {
      return next(new AuthError('Token inválido o expirado'));
    }
  };
}

module.exports = { createAuthMiddleware };