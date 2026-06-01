INSERT INTO users (name, email, password_hash)
VALUES ('EnergyHome Demo', 'demo@energyhome.com', '$2b$10$KIXQ2B2wQ3DqA8C1p0L8Qe5mQZsYp9h8mYw1QhS6rZL3t3QZ0QJfWe')
ON CONFLICT (email) DO NOTHING;