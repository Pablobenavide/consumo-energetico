const storageKey = 'energyhome-mock-db';

function createDefaultDb() {
  return {
    users: [
      {
        id: 1,
        name: 'Energy Demo',
        email: 'demo@energyhome.com',
        password: 'Password123!',
      },
    ],
    appliances: [
      {
        id: 1,
        userId: 1,
        name: 'Nevera inverter',
        powerWatts: 180,
        dailyHours: 24,
        createdAt: new Date().toISOString(),
      },
    ],
    consumptionHistory: [
      {
        id: 1,
        applianceId: 1,
        kwh: 129.6,
        createdAt: new Date().toISOString(),
      },
    ],
    counters: {
      user: 2,
      appliance: 2,
      consumption: 2,
    },
  };
}

function readDb() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    const seed = createDefaultDb();
    localStorage.setItem(storageKey, JSON.stringify(seed));
    return seed;
  }

  return JSON.parse(raw);
}

function writeDb(db) {
  localStorage.setItem(storageKey, JSON.stringify(db));
}

function getTokenUserId(token) {
  const parts = String(token || '').split(':');
  return Number(parts[1] || 1);
}

function createMockToken(userId) {
  return `mock:${userId}`;
}

function buildProfile(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date().toISOString(),
  };
}

function calculateKwh(powerWatts, dailyHours) {
  return Number(((Number(powerWatts) * Number(dailyHours) * 30) / 1000).toFixed(2));
}

function getCurrentUser(db, token) {
  const userId = getTokenUserId(token || localStorage.getItem('energyhome-token'));
  return db.users.find((user) => user.id === userId) || db.users[0];
}

function summaryForUser(db, userId) {
  const appliances = db.appliances.filter((item) => item.userId === userId);
  const history = db.consumptionHistory.filter((entry) => appliances.some((item) => item.id === entry.applianceId));
  const totalConsumption = appliances.reduce((accumulator, appliance) => accumulator + calculateKwh(appliance.powerWatts, appliance.dailyHours), 0);

  return {
    totalConsumption: Number(totalConsumption.toFixed(2)),
    applianceCount: appliances.length,
    averageConsumption: Number((appliances.length ? totalConsumption / appliances.length : 0).toFixed(2)),
    appliances: appliances.map((appliance) => ({
      id: appliance.id,
      name: appliance.name,
      powerWatts: appliance.powerWatts,
      dailyHours: appliance.dailyHours,
      monthlyKwh: calculateKwh(appliance.powerWatts, appliance.dailyHours),
    })),
    monthlySeries: appliances.map((appliance) => ({
      label: appliance.name,
      kwh: calculateKwh(appliance.powerWatts, appliance.dailyHours),
    })),
    history: history.map((entry) => ({
      ...entry,
      appliance_name: appliances.find((item) => item.id === entry.applianceId)?.name || 'Electrodoméstico',
    })),
  };
}

export async function mockRequest(method, path, payload) {
  const db = readDb();

  if (method === 'post' && path === '/auth/register') {
    const email = String(payload.email || '').toLowerCase();
    if (db.users.some((user) => user.email === email)) {
      throw new Error('Ya existe una cuenta con este correo');
    }

    const user = {
      id: db.counters.user++,
      name: payload.name,
      email,
      password: payload.password,
    };
    db.users.push(user);
    writeDb(db);

    return {
      token: createMockToken(user.id),
      user: buildProfile(user),
    };
  }

  if (method === 'post' && path === '/auth/login') {
    const email = String(payload.email || '').toLowerCase();
    const user = db.users.find((item) => item.email === email && item.password === payload.password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    return {
      token: createMockToken(user.id),
      user: buildProfile(user),
    };
  }

  const activeUser = getCurrentUser(db, localStorage.getItem('energyhome-token'));

  if (method === 'get' && path === '/users/profile') {
    return buildProfile(activeUser);
  }

  if (method === 'get' && path === '/appliances') {
    return db.appliances.filter((item) => item.userId === activeUser.id).map((item) => ({
      id: item.id,
      userId: item.userId,
      name: item.name,
      powerWatts: item.powerWatts,
      dailyHours: item.dailyHours,
      monthlyKwh: calculateKwh(item.powerWatts, item.dailyHours),
      createdAt: item.createdAt,
    }));
  }

  if (method === 'get' && path.startsWith('/appliances/')) {
    const id = Number(path.split('/').pop());
    const appliance = db.appliances.find((item) => item.id === id && item.userId === activeUser.id);
    if (!appliance) {
      throw new Error('Electrodoméstico no encontrado');
    }
    return {
      id: appliance.id,
      userId: appliance.userId,
      name: appliance.name,
      powerWatts: appliance.powerWatts,
      dailyHours: appliance.dailyHours,
      monthlyKwh: calculateKwh(appliance.powerWatts, appliance.dailyHours),
      createdAt: appliance.createdAt,
    };
  }

  if (method === 'post' && path === '/appliances') {
    const appliance = {
      id: db.counters.appliance++,
      userId: activeUser.id,
      name: payload.name,
      powerWatts: Number(payload.powerWatts),
      dailyHours: Number(payload.dailyHours),
      createdAt: new Date().toISOString(),
    };
    db.appliances.push(appliance);
    db.consumptionHistory.push({
      id: db.counters.consumption++,
      applianceId: appliance.id,
      kwh: calculateKwh(appliance.powerWatts, appliance.dailyHours),
      createdAt: new Date().toISOString(),
    });
    writeDb(db);
    return {
      id: appliance.id,
      userId: appliance.userId,
      name: appliance.name,
      powerWatts: appliance.powerWatts,
      dailyHours: appliance.dailyHours,
      monthlyKwh: calculateKwh(appliance.powerWatts, appliance.dailyHours),
      createdAt: appliance.createdAt,
    };
  }

  if (method === 'put' && path.startsWith('/appliances/')) {
    const id = Number(path.split('/').pop());
    const appliance = db.appliances.find((item) => item.id === id && item.userId === activeUser.id);
    if (!appliance) {
      throw new Error('Electrodoméstico no encontrado');
    }

    appliance.name = payload.name;
    appliance.powerWatts = Number(payload.powerWatts);
    appliance.dailyHours = Number(payload.dailyHours);
    db.consumptionHistory.push({
      id: db.counters.consumption++,
      applianceId: appliance.id,
      kwh: calculateKwh(appliance.powerWatts, appliance.dailyHours),
      createdAt: new Date().toISOString(),
    });
    writeDb(db);
    return {
      id: appliance.id,
      userId: appliance.userId,
      name: appliance.name,
      powerWatts: appliance.powerWatts,
      dailyHours: appliance.dailyHours,
      monthlyKwh: calculateKwh(appliance.powerWatts, appliance.dailyHours),
      createdAt: appliance.createdAt,
    };
  }

  if (method === 'delete' && path.startsWith('/appliances/')) {
    const id = Number(path.split('/').pop());
    db.appliances = db.appliances.filter((item) => !(item.id === id && item.userId === activeUser.id));
    db.consumptionHistory = db.consumptionHistory.filter((entry) => entry.applianceId !== id);
    writeDb(db);
    return { deleted: true };
  }

  if (method === 'get' && path === '/consumption') {
    return summaryForUser(db, activeUser.id).history;
  }

  if (method === 'get' && path === '/consumption/summary') {
    return summaryForUser(db, activeUser.id);
  }

  if (method === 'get' && path === '/recommendations') {
    const summary = summaryForUser(db, activeUser.id);
    const recommendations = [];
    if (summary.totalConsumption > 100) {
      recommendations.push('Considere reducir el tiempo de uso de los dispositivos de mayor consumo.');
    }
    if (summary.totalConsumption > 300) {
      recommendations.push('Su consumo es elevado. Revise equipos de alto consumo como neveras, calentadores o aires acondicionados.');
    }
    if (!recommendations.length) {
      recommendations.push('Su consumo es saludable. Mantenga hábitos eficientes y revise el uso en horas valle.');
    }
    return {
      totalConsumption: summary.totalConsumption,
      recommendations,
    };
  }

  throw new Error(`Ruta mock no soportada: ${method.toUpperCase()} ${path}`);
}