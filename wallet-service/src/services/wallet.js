const { ResourceNotFoundError } = require("../lib/error");
const Wallet = require("../models/wallet");
const jwt = require("jsonwebtoken");
const axios = require("axios").default;
const baseURlUserService = "http://localhost:3001";

module.exports = {
  async topup(user, { userId, amount }) {
    const isUserExist = await axios.get(
      `${baseURlUserService}/users/${userId}`,
      {
        headers: {
          Authorization:
            "Bearer " + jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
        },
      }
    );

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
