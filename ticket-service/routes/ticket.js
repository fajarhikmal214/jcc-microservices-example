const { Router } = require('express');
const handler = require('../handlers/ticket');
const validation = require('../middlewares/validations');
const route = Router();

route.post('/:id/tickets', validation.eventIdParamValidation, validation.createEventTicketValidation, handler.createEventTicket);
route.get('/:id/tickets', validation.eventIdParamValidation, handler.getEventTickets);
route.get('/:event_id/tickets/:id', validation.eventTicketIdParamValidation, handler.getEventById);

module.exports = route;
