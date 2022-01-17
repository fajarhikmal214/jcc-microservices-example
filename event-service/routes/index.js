const { Router } = require("express");
const route = Router();

route.use("/events", require("./events"));

module.exports = route;
