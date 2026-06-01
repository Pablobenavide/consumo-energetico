function notFoundHandler(_req, _res, next) {
  next({ statusCode: 404, message: 'Ruta no encontrada', code: 'NOT_FOUND' });
}

function errorHandler(error, _req, res, next) {
  void next;
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: error.message || 'Error interno del servidor',
      code: error.code || 'INTERNAL_ERROR',
    },
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};