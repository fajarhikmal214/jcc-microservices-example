const { Router } = require('express');
const handler = require('../handlers/event');
const middleware = require('../middlewares');
const validation = require('../middlewares/validations');
const route = Router();

route.get('/:id', middleware.jwt, validation.eventIdParamValidation, handler.getEventById);
route.get('/', middleware.jwt,  handler.getAllEvent);
route.post('/', middleware.jwt, validation.createEventValidation, handler.createEvent);
route.post('/:id/register', middleware.jwt, validation.eventIdParamValidation, validation.registerEventValidation, handler.registerEvent);

module.exports = route;
