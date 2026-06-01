CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appliances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  power_watts NUMERIC(10, 2) NOT NULL CHECK (power_watts > 0),
  daily_hours NUMERIC(10, 2) NOT NULL CHECK (daily_hours > 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consumption_history (
  id SERIAL PRIMARY KEY,
  appliance_id INTEGER NOT NULL REFERENCES appliances(id) ON DELETE CASCADE,
  kwh NUMERIC(10, 2) NOT NULL CHECK (kwh >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appliances_user_id ON appliances(user_id);
CREATE INDEX IF NOT EXISTS idx_consumption_history_appliance_id ON consumption_history(appliance_id);