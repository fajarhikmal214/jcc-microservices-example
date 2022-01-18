const Ticket = require("../models/ticket");
const logger = require('../lib/logger');
const jwt = require("jsonwebtoken");
const axios = require("axios").default;

if (!process.env.EVENT_SERVICE_URL) {
  logger.fatal('EVENT_SERVICE_URL not provided.');
  process.exit(1);
}

const baseURlEventService = process.env.EVENT_SERVICE_URL;

const {
  ResourceNotFoundError,
  ValidationError,
  EventTicketAlreadyUsedError,
  ForbiddenError,
} = require("../lib/error");

function handleDBValidationError(error) {
  if (error.name === "ValidationError") {
    throw new ValidationError(
      error?.errors?.description?.message || error.message
    );
  }

  throw error;
}

module.exports = {
  async getEventTickets({ user, id }) {
    const event = await axios.get(`${baseURlEventService}/events/${id}`, {
      headers: {
        Authorization:
          "Bearer " + jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
      },
    });

    if (!event.data) {
      throw new ResourceNotFoundError("Event");
    }

    const tickets = await Ticket.find({ eventId: id });

    return tickets.map((ticket) => ticket.toJSON());
  },

  async getEventTicketById({ user, event_id, ticket_id }) {
    const event = await axios.get(`${baseURlEventService}/events/${event_id}`, {
      headers: {
        Authorization:
          "Bearer " + jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
      },
    });

    if (!event.data) {
      throw new ResourceNotFoundError("Event");
    }

    const ticket = await Ticket.findById(ticket_id);

    if (!ticket) {
      throw new ResourceNotFoundError("Event Ticket");
    }

    return ticket.toJSON();
  },

  async createEventTicket({ user, userId, eventId, name, price, quota, date }) {
    const event = await axios.get(`${baseURlEventService}/events/${eventId}`, {
      headers: {
        Authorization:
          "Bearer " + jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
      },
    });
    if (!event.data) {
      throw new ResourceNotFoundError("Event");
    }

    if (event.data.data.creator_id != userId) {
      throw new ForbiddenError("You are not the event creator");
    }

    const ticket = new Ticket({ eventId, name, price, quota, date });

    try {
      await ticket.save();
    } catch (error) {
      if (error.code == 11000) {
        throw new EventTicketAlreadyUsedError();
      }

      handleDBValidationError(error);
    }

    return ticket.toJSON();
  },
};
