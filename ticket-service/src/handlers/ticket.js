const EventService = require("../services/ticket");
const { sendResponse } = require("../lib/api");

module.exports = {
  getEventTickets(req, res, next) {
    EventService.getEventTickets({
      user: req.user,
      id: req.params.id,
    })
      .then(sendResponse(res))
      .catch(next);
  },

  getEventById(req, res, next) {
    EventService.getEventTicketById({
      user: req.user,
      event_id: req.params.id,
      ticket_id: req.params.ticket_id,
    })
      .then(sendResponse(res))
      .catch(next);
  },

  createEventTicket(req, res, next) {
    EventService.createEventTicket({
      user: req.user,
      userId: req.user.id,
      eventId: req.params.id,
      ...req.body,
    })
      .then(sendResponse(res))
      .catch(next);
  },
};
