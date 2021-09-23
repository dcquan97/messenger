
import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";

// Init app
let app = express();

// connect to mongodb
ConnectDB();

// config viewengine
configViewEngine(app);

//config routes
initRoutes(app);

// app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
//   console.log(`Hello Trung Quan, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
// });
var APP_HOST="localhost"
var APP_PORT=8017

app.listen(APP_PORT, APP_HOST, () =>{
  console.log(`Hello Trung Quan, I'm running at ${APP_HOST}:${APP_PORT}`);
});