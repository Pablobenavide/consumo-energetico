const { ValidationError, NotFoundError } = require('../utils/errors');
const { isNonEmptyString } = require('../validators/common');

class ApplianceService {
  constructor({ applianceRepository, consumptionRepository }) {
    this.applianceRepository = applianceRepository;
    this.consumptionRepository = consumptionRepository;
  }

  calculateConsumption(powerWatts, dailyHours) {
    return Number(((Number(powerWatts) * Number(dailyHours) * 30) / 1000).toFixed(2));
  }

  async list(userId) {
    const appliances = await this.applianceRepository.findAllByUserId(userId);
    return appliances.map((appliance) => ({
      ...this.formatAppliance(appliance),
      monthlyKwh: this.calculateConsumption(appliance.power_watts, appliance.daily_hours),
    }));
  }

  async findById(id, userId) {
    const appliance = await this.applianceRepository.findById(id, userId);
    if (!appliance) {
      throw new NotFoundError('Electrodoméstico no encontrado');
    }

    return this.formatAppliance(appliance);
  }

  async create(userId, payload) {
    this.validatePayload(payload);
    const appliance = await this.applianceRepository.create(userId, payload);
    const kwh = this.calculateConsumption(appliance.power_watts, appliance.daily_hours);
    await this.consumptionRepository.addSnapshot(appliance.id, kwh);
    return { ...this.formatAppliance(appliance), monthlyKwh: kwh };
  }

  async update(id, userId, payload) {
    this.validatePayload(payload);
    const appliance = await this.applianceRepository.update(id, userId, payload);
    if (!appliance) {
      throw new NotFoundError('Electrodoméstico no encontrado');
    }

    const kwh = this.calculateConsumption(appliance.power_watts, appliance.daily_hours);
    await this.consumptionRepository.addSnapshot(appliance.id, kwh);
    return { ...this.formatAppliance(appliance), monthlyKwh: kwh };
  }

  async delete(id, userId) {
    const deleted = await this.applianceRepository.delete(id, userId);
    if (!deleted) {
      throw new NotFoundError('Electrodoméstico no encontrado');
    }

    return { deleted: true };
  }

  validatePayload(payload) {
    const { name, powerWatts, dailyHours } = payload;
    if (!isNonEmptyString(name)) {
      throw new ValidationError('El nombre del electrodoméstico es obligatorio');
    }

    if (Number(powerWatts) <= 0) {
      throw new ValidationError('La potencia debe ser mayor a cero');
    }

    if (Number(dailyHours) <= 0) {
      throw new ValidationError('Las horas diarias deben ser mayores a cero');
    }
  }

  formatAppliance(appliance) {
    return {
      id: appliance.id,
      userId: appliance.user_id,
      name: appliance.name,
      powerWatts: Number(appliance.power_watts),
      dailyHours: Number(appliance.daily_hours),
      createdAt: appliance.created_at,
    };
  }
}

module.exports = { ApplianceService };