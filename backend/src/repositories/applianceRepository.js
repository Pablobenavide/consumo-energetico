const { NotFoundError } = require('../utils/errors');

class ApplianceRepository {
  constructor({ pool, store } = {}) {
    this.pool = pool;
    this.store = store;
  }

  async findAllByUserId(userId) {
    if (this.store) {
      return this.store.appliances.filter((appliance) => appliance.user_id === Number(userId));
    }

    const result = await this.pool.query(
      'SELECT id, user_id, name, power_watts, daily_hours, created_at FROM appliances WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );
    return result.rows;
  }

  async findById(id, userId) {
    if (this.store) {
      return this.store.appliances.find(
        (appliance) => appliance.id === Number(id) && appliance.user_id === Number(userId),
      ) || null;
    }

    const result = await this.pool.query(
      'SELECT id, user_id, name, power_watts, daily_hours, created_at FROM appliances WHERE id = $1 AND user_id = $2',
      [id, userId],
    );
    return result.rows[0] || null;
  }

  async create(userId, { name, powerWatts, dailyHours }) {
    if (this.store) {
      const appliance = {
        id: this.store.counters.appliances++,
        user_id: Number(userId),
        name,
        power_watts: Number(powerWatts),
        daily_hours: Number(dailyHours),
        created_at: new Date().toISOString(),
      };
      this.store.appliances.push(appliance);
      return appliance;
    }

    const result = await this.pool.query(
      'INSERT INTO appliances (user_id, name, power_watts, daily_hours) VALUES ($1, $2, $3, $4) RETURNING id, user_id, name, power_watts, daily_hours, created_at',
      [userId, name, powerWatts, dailyHours],
    );
    return result.rows[0];
  }

  async update(id, userId, { name, powerWatts, dailyHours }) {
    if (this.store) {
      const appliance = this.store.appliances.find(
        (item) => item.id === Number(id) && item.user_id === Number(userId),
      );
      if (!appliance) {
        throw new NotFoundError('Electrodoméstico no encontrado');
      }

      appliance.name = name;
      appliance.power_watts = Number(powerWatts);
      appliance.daily_hours = Number(dailyHours);
      return appliance;
    }

    const result = await this.pool.query(
      'UPDATE appliances SET name = $1, power_watts = $2, daily_hours = $3 WHERE id = $4 AND user_id = $5 RETURNING id, user_id, name, power_watts, daily_hours, created_at',
      [name, powerWatts, dailyHours, id, userId],
    );
    return result.rows[0] || null;
  }

  async delete(id, userId) {
    if (this.store) {
      const index = this.store.appliances.findIndex(
        (item) => item.id === Number(id) && item.user_id === Number(userId),
      );
      if (index === -1) {
        return false;
      }
      this.store.appliances.splice(index, 1);
      this.store.consumptionHistory = this.store.consumptionHistory.filter(
        (entry) => entry.appliance_id !== Number(id),
      );
      return true;
    }

    const result = await this.pool.query(
      'DELETE FROM appliances WHERE id = $1 AND user_id = $2',
      [id, userId],
    );
    return result.rowCount > 0;
  }

  async countByUserId(userId) {
    const appliances = await this.findAllByUserId(userId);
    return appliances.length;
  }
}

module.exports = { ApplianceRepository };