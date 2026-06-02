function createRecommendationController(consumptionService, recommendationService) {
  return {
    list: async (req, res, next) => {
      try {
        const summary = await consumptionService.summary(req.user.id);
        return res.status(200).json({
          totalConsumption: summary.totalConsumption,
          recommendations: recommendationService.getRecommendations(summary.totalConsumption),
        });
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = { createRecommendationController };