const jwt = require('jsonwebtoken');

module.exports = {
  generate({ id, username, role }) {
    return jwt.sign({ id, username, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  }
};
