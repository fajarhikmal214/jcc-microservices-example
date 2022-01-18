const Joi = require('joi');
const validateRequest = require('../validate-request');

module.exports = validateRequest(
  Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }),
);