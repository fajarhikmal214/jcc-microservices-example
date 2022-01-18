const humps = require('humps');

module.exports = {
  sendResponse(res, status = 200) {
    return function (payload) {
        return res.status(status).json({
          data: humps.decamelizeKeys(payload),
        });
    };
  }
};
