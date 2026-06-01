const { createApp } = require('./app');
const { env } = require('./config/env');

const app = createApp({
  jwtSecret: env.jwtSecret,
  bcryptRounds: env.bcryptRounds,
  useMemory: env.nodeEnv === 'test' || !process.env.DB_HOST,
  useDatabase: Boolean(process.env.DB_HOST),
});

if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`EnergyHome backend running on port ${env.port}`);
  });
}

module.exports = { app };