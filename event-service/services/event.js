const Event = require('../models/event');
const Ticket = require('../models/ticket');
const EventRegistration = require('../models/event-registration');
const TransactionService = require('./transaction');

const {
  ResourceNotFoundError,
  ValidationError,
  EventTicketAlreadyUsedError,
  UserAlreadyRegisteredToEventError,
  EventAlreadyPassedError,
  ForbiddenError,
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

  async registerEvent({ userId, eventId, ticketId }) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ResourceNotFoundError('Event');
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new ResourceNotFoundError('Ticket');
    }

    const now = new Date();
    if (ticket.date < now) {
      throw new EventAlreadyPassedError();
    }

    // check current registration
    const registered = await EventRegistration.exists({ userId, eventId, ticketId });
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

    const trx = await TransactionService.pay({ userId, item, amount: ticket.price });
    const registration = await EventRegistration.create({ userId, eventId, ticketId });

    return {
      transactionId: trx.id,
      registrationId: registration.id,
      eventId,
      ticketId,
    };
  },
};
