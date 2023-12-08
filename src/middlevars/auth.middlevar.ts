const tokenService = require('../services/token/token.service')
const apiError = require('../error/api-error')
module.exports = function (req:any, res:any, next:any) {

    try {
      
      const authorizatinHeader = req.headers.authorization;
      console.log(authorizatinHeader)
      if (!authorizatinHeader) {
        return next(apiError.UnautorizedError());
      }
      const accessToken = authorizatinHeader.split(' ')[1];
      if (!accessToken) {
        return next(apiError.UnautorizedError());
      }
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(apiError.UnautorizedError());
      }
      
      req.body.id = userData.user.id;
      next();
    } catch (e) {
      return next(apiError.UnautorizedError());
    }
  };
  