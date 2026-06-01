require('dotenv').config();

const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'energyhome-secret',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'energyhome',
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 10),
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = { env };