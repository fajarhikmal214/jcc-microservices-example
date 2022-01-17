const { Router } = require('express');
const route = Router();

route.use('/auth', require('./auth'));

module.exports = route;
