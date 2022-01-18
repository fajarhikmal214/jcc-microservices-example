const AuthService = require('../services/auth');
const { sendResponse } = require('../lib/api');

module.exports = {
  login(req, res, next) {
    AuthService.login(req.body).then(sendResponse(res)).catch(next);
  }  
};
