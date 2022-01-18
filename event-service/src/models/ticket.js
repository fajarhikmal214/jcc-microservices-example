const mongoose = require('mongoose');

const Ticket = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

Ticket.index({ eventId: 1, name: 1}, { unique: true });

Ticket.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('Ticket', Ticket);
