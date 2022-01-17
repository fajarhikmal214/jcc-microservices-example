require('dotenv').config();

// if (!process.env.ACCESS_TOKEN_SECRET) {
//   logger.fatal('ACCESS_TOKEN_SECRET not provided.');
//   process.exit(1);
// }

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const logger = require('./lib/logger');
const { errorHandler, requestLog } = require('./middlewares');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(requestLog);
app.use(router);
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URL, {
        useNewUrlParser: true,
      },
    );
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  app.listen(port, () => logger.info(`App is running on port ${port}`));
}

start();
