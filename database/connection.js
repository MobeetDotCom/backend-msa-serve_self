const { DataSource } = require("typeorm");
const { ENV_LOCAL, ENV_PROD, ENV_STAGING } = require("../constant");
const { formatErrorLog } = require("../utils/error.utils")
const DB_CONFIG = require("./database.config");
const getDBConnetion = async (env) => {
    try {
        let config; 
        switch (env) {
            case ENV_LOCAL:
                config = DB_CONFIG.DB_LOCAL;
                break;
            case ENV_STAGING:
                config = DB_CONFIG.DB_STAGING;
                break;
            case ENV_PROD:
                config = DB_CONFIG.DB_PRODUCTION;
                break;
            default:
                console.error("unknow environment:",process.env.NODE_ENV);
                process.exit(0);
        }
        const DATA_SRC = new DataSource(config);
        return DATA_SRC;
    } catch (error) {
        console.error(error);
    }
}

module.exports =  getDBConnetion;