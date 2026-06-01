function createConsumptionController(consumptionService) {
  return {
    list: async (req, res, next) => {
      try {
        return res.status(200).json(await consumptionService.list(req.user.id));
      } catch (error) {
        return next(error);
      }
    },
    summary: async (req, res, next) => {
      try {
        return res.status(200).json(await consumptionService.summary(req.user.id));
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = { createConsumptionController };