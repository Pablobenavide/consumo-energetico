function createMemoryStore() {
  return {
    users: [],
    appliances: [],
    consumptionHistory: [],
    counters: {
      users: 1,
      appliances: 1,
      consumptionHistory: 1,
    },
  };
}

module.exports = { createMemoryStore };