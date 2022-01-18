const jwt = require('express-jwt');

module.exports = jwt({
  secret: process.env.ACCESS_TOKEN_SECRET,
  algorithms: ['HS256']
});
