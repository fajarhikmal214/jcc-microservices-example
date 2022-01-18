const mongoose = require('mongoose');
const { ResourceNotFoundError } = require('../../lib/error');

module.exports = function (resource, field) {
  return function (req, _, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params[field])) {
      next(new ResourceNotFoundError(resource));
      return;
    }
  
    next();
  }
}