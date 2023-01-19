const { DataSource } = require("typeorm");
const { formatErrorLog } = require("../utils/error.utils");
const connectionConfigs = require("./database.config");
exports.getDBConnection = async (config_name = "serve_self") => {
  try {
    const connection = new DataSource(connectionConfigs[config_name]);
    await connection.initialize();
    return [connection, null];
  } catch (error) {
    global.logger.error(formatErrorLog(error));
    return [null, true];
  }
};