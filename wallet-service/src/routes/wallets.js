const { Router } = require('express');
const handler = require('../handlers/wallet');
const middleware = require('../middlewares');
const validation = require('../middlewares/validations');
const route = Router();

route.post('/topup', middleware.jwt, middleware.authorize("admin"), validation.topupWalletValidation, handler.topup);
route.get('/', middleware.authorize("admin"), handler.getAllWallet);
route.get('/users/:id', validation.userIdParamValidation, handler.getWalletByUserId);
route.patch('/users/:id', validation.userIdParamValidation, validation.updateWalletBalanceValidation, handler.UpdateWalletBalance);

module.exports = route;