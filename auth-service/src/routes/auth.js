const { Router } = require('express');
const handler = require('../handlers/auth');
const validation = require('../middlewares/validations');
const route = Router();

route.post('/login', validation.loginValidation, handler.login);

module.exports = route;
