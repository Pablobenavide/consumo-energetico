const { createMemoryStore } = require('./memoryStore');
const { UserRepository } = require('./userRepository');
const { ApplianceRepository } = require('./applianceRepository');
const { ConsumptionRepository } = require('./consumptionRepository');

function buildRepositories({ pool, useMemory = false } = {}) {
  const store = useMemory ? createMemoryStore() : null;

  return {
    store,
    userRepository: new UserRepository({ pool, store }),
    applianceRepository: new ApplianceRepository({ pool, store }),
    consumptionRepository: new ConsumptionRepository({ pool, store }),
  };
}

module.exports = { buildRepositories };