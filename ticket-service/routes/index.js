const { Router } = require("express");
const route = Router();

route.use("/events", require("./ticket"));

module.exports = route;
