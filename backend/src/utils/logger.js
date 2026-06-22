
const pino = require("pino");

const config = require("../config");
const logger = pino({
  level: config.logLevel || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
