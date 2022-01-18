const Transaction = require("../models/transaction");
const axios = require("axios");
const logger = require('../lib/logger');

const {
  WalletBalanceNotSufficientError,
  ResourceNotFoundError,
} = require("../lib/error");


if (!process.env.WALLET_SERVICE_URL) {
  logger.fatal('WALLET_SERVICE_URL not provided.');
  process.exit(1);
}

const BaseURLWalletService = process.env.WALLET_SERVICE_URL;

module.exports = {
  async pay({ userId, item, amount }) {
    if (amount > 0) {
      // TODO :
      // Add Middleware to Authorization

      const wallet = await axios.get(
        `${BaseURLWalletService}/wallets/users/${userId}`
      );

      if (!wallet.data) {
        throw new ResourceNotFoundError("User");
      }

      const balance = wallet.data.data.balance || 0;

      if (balance < amount) {
        throw new WalletBalanceNotSufficientError();
      }

      // TODO :
      // Add Middleware to Authorization

      await axios.patch(`${BaseURLWalletService}/wallets/users/${userId}`, {
        amount,
      });
    }

    const trx = await Transaction.create({ userId, amount, item });

    // TODO:
    // rollback deduction if trx failed

    return trx.toJSON();
  },
};
