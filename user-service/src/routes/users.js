const { Router } = require('express');
const handler = require('../handlers/user');
const validation = require('../middlewares/validations');
const route = Router();

route.get('/', handler.getAllUser);
route.get('/:id', validation.userIdParamValidation, handler.getUserById);
route.post('/', validation.registerValidation, handler.register);

module.exports = route;
