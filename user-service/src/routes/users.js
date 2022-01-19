const { Router } = require('express');
const handler = require('../handlers/user');
const validation = require('../middlewares/validations');
const middleware = require('../middlewares');
const route = Router();

route.get('/:id', middleware.jwt, validation.userIdParamValidation, handler.getUserById);
route.get('/', middleware.authorize("admin"), handler.getAllUser);
route.post('/', validation.registerValidation, handler.register);

module.exports = route;
