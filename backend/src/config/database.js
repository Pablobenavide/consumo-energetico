const { Pool } = require('pg');
const { env } = require('./env');

/**
 * Creates a PostgreSQL connection pool from the configured environment.
 * @returns {Pool} PostgreSQL pool instance.
 */
function createPool() {
  return new Pool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
  });
}

module.exports = { createPool };