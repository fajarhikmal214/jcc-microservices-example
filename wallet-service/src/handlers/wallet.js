const WalletService = require('../services/wallet');
const { sendResponse } = require('../lib/api');

module.exports = {
  topup(req, res, next) {
    WalletService.topup(req.user, req.body).then(sendResponse(res)).catch(next);
  },

  getAllWallet(req, res, next) {
    WalletService.getAllWallet().then(sendResponse(res)).catch(next);
  },

  getWalletByUserId(req, res, next) {
    WalletService.getWalletByUserId(req.params.id).then(sendResponse(res)).catch(next)
  },

  UpdateWalletBalance(req, res, next) {
    WalletService.UpdateWalletBalance(req.params.id, req.body).then(sendResponse(res)).catch(next)
  },
};