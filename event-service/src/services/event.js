const Event = require('../models/event');
const EventRegistration = require('../models/event-registration');
const TransactionService = require('./transaction');
const logger = require('../lib/logger');
const jwt = require("jsonwebtoken");
const axios = require('axios')

if (!process.env.TICKET_SERVICE_URL) {
  logger.fatal('TICKET_SERVICE_URL not provided.');
  process.exit(1);
}

const BaseURLTicketService = process.env.TICKET_SERVICE_URL

const {
  ResourceNotFoundError,
  ValidationError,
  UserAlreadyRegisteredToEventError,
  EventAlreadyPassedError,
} = require('../lib/error');

function handleDBValidationError(error) {
  if (error.name === 'ValidationError') {
    throw new ValidationError(error?.errors?.description?.message || error.message);
  }

  throw error;
}

module.exports = {
  async getEventById(id) {
    const event = await Event.findById(id);
    if (!event) {
      throw new ResourceNotFoundError('Event');
    }
  
    return event.toJSON();
  },

  async getAllEvent() {
    const events = await Event.find();

    return events.map(event => event.toJSON());
  },

  async createEvent({ name, description, creatorId }) {
    const event = new Event({ name, description, creatorId });

    try {
      await event.save();
    } catch (error) {
      handleDBValidationError(error);
    }
    
    return event.toJSON();
  },

  async registerEvent({ user, eventId, ticketId }) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ResourceNotFoundError('Event');
    }

    const ticket = await axios.get(`${BaseURLTicketService}/events/${eventId}/tickets/${ticketId}`, {
      headers: {
        Authorization:
          "Bearer " + jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
      },
    });

    if (!ticket.data) {
      throw new ResourceNotFoundError('Ticket');
    }

    const now = new Date();
    if (ticket.date < now) {
      throw new EventAlreadyPassedError();
    }

    // check current registration
    const registered = await EventRegistration.exists({ userId: user.id, eventId, ticketId });
    if (registered) {
      throw new UserAlreadyRegisteredToEventError();
    }

    const item = {
      name: 'event_registration',
      details: {
        eventId,
        ticketId,
      },
    };

    const trx = await TransactionService.pay({ userId: user.id, item, amount: ticket.data.data.price });
    const registration = await EventRegistration.create({ userId: user.id, eventId, ticketId });

    return {
      transactionId: trx.id,
      registrationId: registration.id,
      eventId,
      ticketId,
    };
  },
};
