const Joi = require('joi');
const validateRequest = require('../validate-request');

module.exports = validateRequest(
  Joi.object({
    name: Joi.string().required().min(6).max(25),
    price: Joi.number().required(),
    date: Joi.date().iso().required(),
    userId: Joi.string().required()
  }),
);
