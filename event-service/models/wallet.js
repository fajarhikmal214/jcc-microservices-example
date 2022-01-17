const mongoose = require('mongoose');
const { WalletBalanceNotSufficientError } = require('../lib/error');

const Wallet = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

Wallet.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

Wallet.statics.findByUserIdOrCreate = async function (userId) {
  const wallet = (await this.findOne({ userId })) || (await this.create({ userId, balance: 0 }));
  return wallet;
}

Wallet.statics.topup = async function (userId, amount) {
  const wallet = await this.findByUserIdOrCreate(userId);
  const updated = await this.findByIdAndUpdate(wallet.id, { $inc: { balance: amount } }, { new: true });

  return updated;
};

Wallet.statics.deduct = async function (userId, amount) {
  const wallet = await this.findOne({ userId });
  const balance = wallet?.balance || 0;

  if (balance < amount) {
    throw new WalletBalanceNotSufficientError();
  }

  await this.updateOne({ userId }, { $inc: { balance: -amount } });
};

module.exports = mongoose.model('Wallet', Wallet);
