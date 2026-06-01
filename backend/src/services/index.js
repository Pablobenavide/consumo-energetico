const { AuthService } = require('./authService');
const { ApplianceService } = require('./applianceService');
const { ConsumptionService } = require('./consumptionService');
const { RecommendationService } = require('./recommendationService');

function buildServices(repositories, config = {}) {
  const authService = new AuthService({
    userRepository: repositories.userRepository,
    jwtSecret: config.jwtSecret,
    bcryptRounds: config.bcryptRounds,
  });

  return {
    authService,
    applianceService: new ApplianceService({
      applianceRepository: repositories.applianceRepository,
      consumptionRepository: repositories.consumptionRepository,
    }),
    consumptionService: new ConsumptionService({
      applianceRepository: repositories.applianceRepository,
      consumptionRepository: repositories.consumptionRepository,
    }),
    recommendationService: new RecommendationService(),
  };
}

module.exports = { buildServices };