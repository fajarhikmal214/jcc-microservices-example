const EventService = require("../services/ticket");
const { sendResponse } = require("../lib/api");

module.exports = {
  getEventTickets(req, res, next) {
    EventService.getEventTickets(req.params.id)
      .then(sendResponse(res))
      .catch(next);
  },

  getEventById(req, res, next) {
    EventService.getEventTicketById(req.params.event_id, req.params.id)
      .then(sendResponse(res))
      .catch(next);
  },

  createEventTicket(req, res, next) {
    EventService.createEventTicket({
      eventId: req.params.id,
      ...req.body,
    })
      .then(sendResponse(res))
      .catch(next);
  },
};
