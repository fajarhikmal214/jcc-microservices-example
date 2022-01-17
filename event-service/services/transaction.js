const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');

module.exports = {
  async pay({ userId, item, amount }) {
    if (amount > 0) {
      await Wallet.deduct(userId, amount);
    }

    const trx = await Transaction.create({ userId, amount, item });

    // TODO:
    // rollback deduction if trx failed

    return trx.toJSON();
  },
}
