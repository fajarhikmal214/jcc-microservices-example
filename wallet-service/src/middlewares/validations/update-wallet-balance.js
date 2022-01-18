const Joi = require("joi");
const validateRequest = require("../validate-request");

module.exports = validateRequest(
  Joi.object({
    amount: Joi.number().positive().required(),
  })
);
