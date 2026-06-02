const { NotFoundError } = require('../utils/errors');

class UserRepository {
  constructor({ pool, store } = {}) {
    this.pool = pool;
    this.store = store;
  }

  async findByEmail(email) {
    if (this.store) {
      return this.store.users.find((user) => user.email === email) || null;
    }

    const result = await this.pool.query(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] || null;
  }

  async findById(id) {
    if (this.store) {
      return this.store.users.find((user) => user.id === Number(id)) || null;
    }

    const result = await this.pool.query(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async create({ name, email, passwordHash }) {
    if (this.store) {
      const user = {
        id: this.store.counters.users++,
        name,
        email,
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
      };
      this.store.users.push(user);
      return user;
    }

    const result = await this.pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, password_hash, created_at',
      [name, email, passwordHash],
    );
    return result.rows[0];
  }

  async getProfile(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    };
  }
}

module.exports = { UserRepository };