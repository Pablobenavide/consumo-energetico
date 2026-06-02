class ConsumptionRepository {
  constructor({ pool, store } = {}) {
    this.pool = pool;
    this.store = store;
  }

  async addSnapshot(applianceId, kwh) {
    if (this.store) {
      const appliance = this.store.appliances.find((item) => item.id === Number(applianceId));
      if (!appliance) {
        return null;
      }

      const entry = {
        id: this.store.counters.consumptionHistory++,
        appliance_id: Number(applianceId),
        kwh: Number(kwh),
        created_at: new Date().toISOString(),
      };
      this.store.consumptionHistory.push(entry);
      return entry;
    }

    const result = await this.pool.query(
      'INSERT INTO consumption_history (appliance_id, kwh) VALUES ($1, $2) RETURNING id, appliance_id, kwh, created_at',
      [applianceId, kwh],
    );
    return result.rows[0];
  }

  async listByUserId(userId) {
    if (this.store) {
      const appliances = this.store.appliances.filter((item) => item.user_id === Number(userId));
      return this.store.consumptionHistory
        .map((entry) => ({
          ...entry,
          appliance_name: appliances.find((item) => item.id === entry.appliance_id)?.name || 'Electrodoméstico',
        }))
        .filter((entry) => appliances.some((item) => item.id === entry.appliance_id));
    }

    const result = await this.pool.query(
      `SELECT ch.id, ch.appliance_id, a.name AS appliance_name, ch.kwh, ch.created_at
       FROM consumption_history ch
       INNER JOIN appliances a ON a.id = ch.appliance_id
       WHERE a.user_id = $1
       ORDER BY ch.created_at DESC`,
      [userId],
    );
    return result.rows;
  }
}

module.exports = { ConsumptionRepository };