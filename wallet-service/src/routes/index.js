const { Router } = require("express");
const route = Router();

route.use('/wallets', require('./wallets'));

module.exports = route;
