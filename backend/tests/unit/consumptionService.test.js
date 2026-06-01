const { ConsumptionService } = require('../../src/services/consumptionService');

describe('ConsumptionService', () => {
  const applianceRepository = {
    findAllByUserId: jest.fn(),
  };
  const consumptionRepository = {
    listByUserId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds a summary from appliances', async () => {
    applianceRepository.findAllByUserId.mockResolvedValue([
      { id: 1, name: 'Nevera', power_watts: 180, daily_hours: 24 },
      { id: 2, name: 'Lavadora', power_watts: 800, daily_hours: 1 },
    ]);
    consumptionRepository.listByUserId.mockResolvedValue([{ id: 1, kwh: 129.6 }]);

    const service = new ConsumptionService({ applianceRepository, consumptionRepository });
    const summary = await service.summary(5);

    expect(summary.totalConsumption).toBe(153.6);
    expect(summary.applianceCount).toBe(2);
    expect(summary.averageConsumption).toBe(76.8);
    expect(summary.history).toEqual([{ id: 1, kwh: 129.6 }]);
    expect(summary.appliances).toHaveLength(2);
  });

  it('lists consumption history', async () => {
    consumptionRepository.listByUserId.mockResolvedValue([{ id: 10, appliance_name: 'Nevera', kwh: 129.6 }]);
    const service = new ConsumptionService({ applianceRepository, consumptionRepository });

    await expect(service.list(5)).resolves.toEqual([{ id: 10, appliance_name: 'Nevera', kwh: 129.6 }]);
  });

  it('returns zeroed summary when there are no appliances', async () => {
    applianceRepository.findAllByUserId.mockResolvedValue([]);
    consumptionRepository.listByUserId.mockResolvedValue([]);
    const service = new ConsumptionService({ applianceRepository, consumptionRepository });

    const summary = await service.summary(5);

    expect(summary.totalConsumption).toBe(0);
    expect(summary.averageConsumption).toBe(0);
    expect(summary.appliances).toEqual([]);
    expect(summary.monthlySeries).toEqual([]);
  });
});