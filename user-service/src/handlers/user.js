const UserService = require('../services/user');
const { sendResponse } = require('../lib/api');

module.exports = {
  getUserById(req, res, next) {
    UserService.getUserById(req.params.id).then(sendResponse(res)).catch(next);
  },

  getAllUser(req, res, next) {
    UserService.getAllUser().then(sendResponse(res)).catch(next);
  },

  register(req, res, next) {
    UserService.register(req.body).then(sendResponse(res, 201)).catch(next);
  }
};
