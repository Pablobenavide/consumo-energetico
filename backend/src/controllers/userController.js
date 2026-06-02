function createUserController(authService) {
  return {
    profile: async (req, res, next) => {
      try {
        const profile = await authService.profile(req.user.id);
        return res.status(200).json(profile);
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = { createUserController };