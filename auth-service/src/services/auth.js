const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const User = require('../models/user');
const { InvalidLoginError } = require('../lib/error');

const basicDetails = ({ id, username, role }) => ({ id, username, role });

module.exports = {
  async login({ username, password}) {
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new InvalidLoginError();
    }
  
    const accessToken = jwt.generate(user);
  
    return {
      ...basicDetails(user),
      accessToken
    };
  }
}
