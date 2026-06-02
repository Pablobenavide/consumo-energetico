function createApplianceController(applianceService) {
  return {
    list: async (req, res, next) => {
      try {
        return res.status(200).json(await applianceService.list(req.user.id));
      } catch (error) {
        return next(error);
      }
    },
    getById: async (req, res, next) => {
      try {
        return res.status(200).json(await applianceService.findById(req.params.id, req.user.id));
      } catch (error) {
        return next(error);
      }
    },
    create: async (req, res, next) => {
      try {
        return res.status(201).json(await applianceService.create(req.user.id, req.body));
      } catch (error) {
        return next(error);
      }
    },
    update: async (req, res, next) => {
      try {
        return res.status(200).json(await applianceService.update(req.params.id, req.user.id, req.body));
      } catch (error) {
        return next(error);
      }
    },
    remove: async (req, res, next) => {
      try {
        return res.status(200).json(await applianceService.delete(req.params.id, req.user.id));
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = { createApplianceController };