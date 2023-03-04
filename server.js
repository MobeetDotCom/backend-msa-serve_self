require("dotenv").config({path:`.env.${process.env.NODE_ENV}`});
const express = require("express");
global.logger = require("./configs/logger.config");
const http = require("http");
const { ENV_PROD, ENV_LOCAL, ENV_STAGING } = require("./constant");
const DB_CONFIG = require("./configs/database.config.json");
const app = express();
const PORT = process.env.PORT || 8000 ;
// Disable console.log in prod
if(process.env.NODE_ENV===ENV_PROD){
  console.log = ()=>{};
}

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
  global.logger.info(`server is listning at ${PORT}, instance_pid:${process.pid}`);
  const server_info = {env:process.env.NODE_ENV,port:PORT,pid:process.pid,msa:process.env.MSA}
  console.log(server_info);
});

