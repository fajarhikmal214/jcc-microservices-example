const { Router } = require('express');
const handler = require('../handlers/event');
const validation = require('../middlewares/validations');
const route = Router();

route.get('/:id', validation.eventIdParamValidation, handler.getEventById);
route.get('/', handler.getAllEvent);
route.post('/', validation.createEventValidation, handler.createEvent);
route.post('/:id/register', validation.eventIdParamValidation, validation.registerEventValidation, handler.registerEvent);

module.exports = route;
