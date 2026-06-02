class ConsumptionService {
  constructor({ applianceRepository, consumptionRepository }) {
    this.applianceRepository = applianceRepository;
    this.consumptionRepository = consumptionRepository;
  }

  async list(userId) {
    return this.consumptionRepository.listByUserId(userId);
  }

  async summary(userId) {
    const appliances = await this.applianceRepository.findAllByUserId(userId);
    const history = await this.consumptionRepository.listByUserId(userId);
    const totalConsumption = appliances.reduce(
      (accumulator, appliance) => accumulator + ((appliance.power_watts * appliance.daily_hours * 30) / 1000),
      0,
    );

    return {
      totalConsumption: Number(totalConsumption.toFixed(2)),
      applianceCount: appliances.length,
      averageConsumption: Number((appliances.length ? totalConsumption / appliances.length : 0).toFixed(2)),
      history,
      appliances: appliances.map((appliance) => ({
        id: appliance.id,
        name: appliance.name,
        monthlyKwh: Number((((appliance.power_watts * appliance.daily_hours * 30) / 1000)).toFixed(2)),
      })),
      monthlySeries: appliances.map((appliance) => ({
        label: appliance.name,
        kwh: Number((((appliance.power_watts * appliance.daily_hours * 30) / 1000)).toFixed(2)),
      })),
    };
  }
}

module.exports = { ConsumptionService };