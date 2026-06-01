const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'EnergyHome API',
    version: '1.0.0',
    description: 'API REST para gestión y visualización de consumo energético en el hogar.',
  },
  servers: [{ url: 'http://localhost:4000', description: 'Local' }],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Appliances' },
    { name: 'Consumption' },
    { name: 'Recommendations' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      AuthRegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
      ApplianceRequest: {
        type: 'object',
        required: ['name', 'powerWatts', 'dailyHours'],
        properties: {
          name: { type: 'string' },
          powerWatts: { type: 'number' },
          dailyHours: { type: 'number' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthRegisterRequest' } } },
        },
        responses: { 201: { description: 'Usuario registrado' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthRegisterRequest' } } },
        },
        responses: { 200: { description: 'Autenticación correcta' } },
      },
    },
    '/api/users/profile': {
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Perfil del usuario autenticado',
        responses: { 200: { description: 'Perfil' } },
      },
    },
    '/api/appliances': {
      get: {
        tags: ['Appliances'],
        security: [{ bearerAuth: [] }],
        summary: 'Listar electrodomésticos',
      },
      post: {
        tags: ['Appliances'],
        security: [{ bearerAuth: [] }],
        summary: 'Crear electrodoméstico',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ApplianceRequest' } } },
        },
      },
    },
    '/api/appliances/{id}': {
      get: { tags: ['Appliances'], security: [{ bearerAuth: [] }], summary: 'Obtener electrodoméstico' },
      put: { tags: ['Appliances'], security: [{ bearerAuth: [] }], summary: 'Actualizar electrodoméstico' },
      delete: { tags: ['Appliances'], security: [{ bearerAuth: [] }], summary: 'Eliminar electrodoméstico' },
    },
    '/api/consumption': {
      get: { tags: ['Consumption'], security: [{ bearerAuth: [] }], summary: 'Historial de consumo' },
    },
    '/api/consumption/summary': {
      get: { tags: ['Consumption'], security: [{ bearerAuth: [] }], summary: 'Resumen de consumo' },
    },
    '/api/recommendations': {
      get: { tags: ['Recommendations'], security: [{ bearerAuth: [] }], summary: 'Recomendaciones energéticas' },
    },
  },
};

module.exports = { swaggerDocument };