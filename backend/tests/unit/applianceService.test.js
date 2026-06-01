const { ApplianceService } = require('../../src/services/applianceService');

describe('ApplianceService', () => {
  const applianceRepository = {
    findAllByUserId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const consumptionRepository = {
    addSnapshot: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates monthly kWh', () => {
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    expect(service.calculateConsumption(100, 10)).toBe(30);
  });

  it('lists appliances with computed kWh', async () => {
    applianceRepository.findAllByUserId.mockResolvedValue([
      { id: 1, user_id: 5, name: 'Nevera', power_watts: 180, daily_hours: 24, created_at: '2026-01-01' },
    ]);
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    await expect(service.list(5)).resolves.toEqual([
      {
        id: 1,
        userId: 5,
        name: 'Nevera',
        powerWatts: 180,
        dailyHours: 24,
        createdAt: '2026-01-01',
        monthlyKwh: 129.6,
      },
    ]);
  });

  it('returns an appliance by id', async () => {
    applianceRepository.findById.mockResolvedValue({
      id: 1,
      user_id: 5,
      name: 'Lavadora',
      power_watts: 800,
      daily_hours: 1,
      created_at: '2026-01-01',
    });
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    await expect(service.findById(1, 5)).resolves.toEqual({
      id: 1,
      userId: 5,
      name: 'Lavadora',
      powerWatts: 800,
      dailyHours: 1,
      createdAt: '2026-01-01',
    });
  });

  it('throws when an appliance is missing', async () => {
    applianceRepository.findById.mockResolvedValue(null);
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    await expect(service.findById(1, 5)).rejects.toThrow('Electrodoméstico no encontrado');
  });

  it('creates an appliance and snapshots consumption', async () => {
    applianceRepository.create.mockResolvedValue({
      id: 9,
      user_id: 5,
      name: 'Ventilador',
      power_watts: 75,
      daily_hours: 6,
      created_at: '2026-01-01',
    });
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    const result = await service.create(5, { name: 'Ventilador', powerWatts: 75, dailyHours: 6 });

    expect(applianceRepository.create).toHaveBeenCalledWith(5, {
      name: 'Ventilador',
      powerWatts: 75,
      dailyHours: 6,
    });
    expect(consumptionRepository.addSnapshot).toHaveBeenCalledWith(9, 13.5);
    expect(result.monthlyKwh).toBe(13.5);
  });

  it('updates an appliance and snapshots consumption', async () => {
    applianceRepository.update.mockResolvedValue({
      id: 9,
      user_id: 5,
      name: 'Ventilador turbo',
      power_watts: 90,
      daily_hours: 5,
      created_at: '2026-01-01',
    });
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    const result = await service.update(9, 5, { name: 'Ventilador turbo', powerWatts: 90, dailyHours: 5 });

    expect(applianceRepository.update).toHaveBeenCalledWith(9, 5, {
      name: 'Ventilador turbo',
      powerWatts: 90,
      dailyHours: 5,
    });
    expect(consumptionRepository.addSnapshot).toHaveBeenCalledWith(9, 13.5);
    expect(result.monthlyKwh).toBe(13.5);
  });

  it('throws when updating a missing appliance', async () => {
    applianceRepository.update.mockResolvedValue(null);
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    await expect(service.update(9, 5, { name: 'X', powerWatts: 1, dailyHours: 1 })).rejects.toThrow(
      'Electrodoméstico no encontrado',
    );
  });

  it('deletes an appliance', async () => {
    applianceRepository.delete.mockResolvedValue(true);
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    await expect(service.delete(9, 5)).resolves.toEqual({ deleted: true });
  });

  it('throws when deleting a missing appliance', async () => {
    applianceRepository.delete.mockResolvedValue(false);
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    await expect(service.delete(9, 5)).rejects.toThrow('Electrodoméstico no encontrado');
  });

  it('validates payload fields', () => {
    const service = new ApplianceService({ applianceRepository, consumptionRepository });

    expect(() => service.validatePayload({ name: '', powerWatts: 1, dailyHours: 1 })).toThrow(
      'El nombre del electrodoméstico es obligatorio',
    );
    expect(() => service.validatePayload({ name: 'A', powerWatts: 0, dailyHours: 1 })).toThrow(
      'La potencia debe ser mayor a cero',
    );
    expect(() => service.validatePayload({ name: 'A', powerWatts: 1, dailyHours: 0 })).toThrow(
      'Las horas diarias deben ser mayores a cero',
    );
  });
});