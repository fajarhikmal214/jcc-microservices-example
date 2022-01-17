const bcrypt = require('bcrypt');
const User = require('../models/user');
const { UserNotFoundError, UserAlreadyUsedError } = require('../lib/error');

const basicDetails = ({ id, username, role }) => ({ id, username, role });

module.exports = {
  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }
  
    return basicDetails(user);
  },

  async getAllUser() {
    const users = await User.find();

    return users.map(basicDetails);
  },

  async register({ username, password, role }) {
    const user = new User({ username, role });
    user.password = await bcrypt.hash(password, 10);
  
    try {
      await user.save();
    } catch (err) {
      if (err.code == 11000) {
        throw new UserAlreadyUsedError()
      }

      throw err;
    }
  
    return basicDetails(user);
  }
}
