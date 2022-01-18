const mongoose = require('mongoose');
const { ValidationError } = require('../../lib/error');

module.exports = function (req, _, next) {
  if (!mongoose.Types.ObjectId.isValid(req.body.ticketId)) {
    next(new ValidationError('ticketId not valid'));
    return;
  }

  next();
}