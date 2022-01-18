const { ResourceNotFoundError } = require("../lib/error");
const Wallet = require("../models/wallet");
const jwt = require("jsonwebtoken");
const axios = require("axios").default;
const logger = require('../lib/logger');
const { callWithRetry } = require('../lib/failure-handling');

if (!process.env.USER_SERVICE_URL) {
  logger.fatal('USER_SERVICE_URL not provided.');
  process.exit(1);
}

const baseURlUserService = process.env.USER_SERVICE_URL;

module.exports = {
  async topup(user, { userId, amount }) {
    const isUserExist = await callWithRetry(() => {
      return axios.get(
        `${baseURlUserService}/users/${userId}`,
        {
          headers: {
            Authorization:
              "Bearer " + jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
          },
        }
      )
    }, 5);

    if (!isUserExist) {
      throw new ResourceNotFoundError("User");
    }

    const wallet = await Wallet.topup(userId, amount);

    return wallet.toJSON();
  },

  async getAllWallet() {
    const wallets = await Wallet.find();

    return wallets.map((wallet) => wallet.toJSON());
  },

  async getWalletByUserId(userId) {
    const wallet = await Wallet.findOne({ userId }).exec();

    if (!wallet) {
      throw new ResourceNotFoundError("Wallet");
    }

    return wallet.toJSON();
  },

  async UpdateWalletBalance(userId, { amount }) {
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      throw new ResourceNotFoundError("Wallet");
    }

    await Wallet.deduct(userId, amount)
    const updatedWallet = await Wallet.findOne({ userId });

    return updatedWallet.toJSON();
  },
};
