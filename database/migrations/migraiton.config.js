const getDBConnetion = require("../connection");
exports.default = getDBConnetion(process.env.NODE_ENV);