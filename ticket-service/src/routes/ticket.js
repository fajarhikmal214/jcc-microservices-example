const { Router } = require('express');
const handler = require('../handlers/ticket');
const middleware = require('../middlewares');
const validation = require('../middlewares/validations');
const route = Router();

route.post('/:id/tickets',middleware.jwt, validation.eventIdParamValidation, validation.createEventTicketValidation, handler.createEventTicket);
route.get('/:id/tickets', middleware.jwt, validation.eventIdParamValidation, handler.getEventTickets);
route.get('/:id/tickets/:ticket_id', middleware.jwt, validation.eventIdParamValidation, validation.eventTicketIdParamValidation, handler.getEventById);

module.exports = route;
