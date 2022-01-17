const Ticket = require("../models/ticket");
const axios = require("axios").default;
const baseURlEventService = "http://localhost:3000";

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
  async getEventTickets(id) {
    const event = await axios.get(`${baseURlEventService}/events/${id}`);

    if (!event) {
      throw new ResourceNotFoundError("Event");
    }

    const tickets = await Ticket.find();

    return tickets.map((ticket) => ticket.toJSON());
  },

  async getEventTicketById(event_id, id) {
    const event = await axios.get(`${baseURlEventService}/events/${event_id}`);

    if (!event) {
      throw new ResourceNotFoundError("Event");
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new ResourceNotFoundError("Event Ticket");
    }

    return ticket.toJSON();
  },

  async getEventById(id) {
    const event = await Event.findById(id);
    if (!event) {
      throw new ResourceNotFoundError("Event");
    }

    return event.toJSON();
  },

  async createEventTicket({ userId, eventId, name, price, quota, date }) {
    const event = await axios.get(`${baseURlEventService}/events/${eventId}`);
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
