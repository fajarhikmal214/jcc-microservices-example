const jwt = require('./jwt');

function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate jwt token
    jwt,

    // authorize user role
    function (req, res, next) {
      if (!req.user || (roles.length && !roles.includes(req.user.role))) {
        res.status(401).json({ message: 'You aren\'t authorize to access this' });
        return;
      }

      next();
    },
  ];
}

module.exports = authorize;
