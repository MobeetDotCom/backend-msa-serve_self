require("dotenv").config();
const express = require("express");
global.logger = require("./configs/logger.config");
const http = require("http");
const ENV_JSON = require("./configs/env.config");
const { CONSTANT } = require("./constant");
const {dbConnection,initialAllConnections,initialzeConnection, closeAllConnection} = require("@mobeetdotcom/orm");
const { formatErrorLog } = require("./utils/error.utils");
const app = express();
const router = require("./route");
const PORT = ENV_JSON().SERVER.PORT || 8000 ;
// Disable console.log in prod
if(process.env.NODE_ENV===CONSTANT.ENV.PROD){
  console.log = ()=>{};
}

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.disable('x-powered-by');
app.use(`/api/${ENV_JSON().SERVER.MSA}`,router);

app.get("/ping",async(req,res)=>{ 
    res.status(200).json({pid:process.pid});
});

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  switch (error.code) {
    case "EACCES":
      console.error(PORT + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(PORT + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
};
app.set("port", PORT);
const server = http.createServer(app);
server.on("error", onError);
server.listen(PORT, async () => {
  try {
    // Initializing all dbconnections
    await initialAllConnections(dbConnection);

    if(!process.env.NODE_ENV){
      console.log("❌ NODE_ENV IS NOT SET");
      await closeAllConnection(dbConnection);
      process.exit(0);
    }
    global.logger.info(`server is listning at ${PORT}, instance_pid:${process.pid}`);
    const server_info = {env:process.env.NODE_ENV,port:ENV_JSON().SERVER.PORT,pid:process.pid,msa:ENV_JSON().SERVER.MSA}
    console.log(server_info);
 
  } catch (error) {
    console.log("❌ Couldn't start the server");
    global.logger.error(formatErrorLog(error));
    process.exit(0);
  }
});

