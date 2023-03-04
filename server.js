require("dotenv").config();
const express = require("express");
global.logger = require("./configs/logger.config");
const http = require("http");
const ENV_JSON = require("./configs/env.config");
const { CONSTANT } = require("./constant");
const app = express();

const PORT = ENV_JSON().SERVER.PORT || 8000 ;
// Disable console.log in prod
if(process.env.NODE_ENV===CONSTANT.ENV.PROD){
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
  const server_info = {env:process.env.NODE_ENV,port:ENV_JSON().SERVER.PORT,pid:process.pid,msa:ENV_JSON().SERVER.MSA}
  console.log(server_info);
});

