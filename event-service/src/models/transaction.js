const mongoose = require('mongoose');

const Transaction = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  item: {
    type: {
      name: {
        type: String,
        required: true
      },
      details: {}
    }
  },
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

Transaction.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model('Transaction', Transaction);
