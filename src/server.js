import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import bodyParser from "body-parser";
import configSession from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";

require('dotenv').config();

// Init app
let app = express();

// Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// connect to mongodb
ConnectDB();

// Config session

configSession(app);

// config viewengine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// Enable flash message
app.use(connectFlash());

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

//config routes
initRoutes(app);

//init all sockets
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
  console.log(`Hello Trung Quan, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
});

// import https from "https";
// import pem from "pem";
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err;
//   }
//   // Init app
//   let app = express();

//   // connect to mongodb
//   ConnectDB();

//   // Config session

//   configSession(app);

//   // config viewengine
//   configViewEngine(app);

//   // Enable post data for request
//   app.use(bodyParser.urlencoded({ extended: true }));

//   // Enable flash message
//   app.use(connectFlash());

//   // Config passport js
//   app.use(passport.initialize());
//   app.use(passport.session());

//   //config routes
//   initRoutes(app);

//   https.createServer({ key: keys.clientKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
//     console.log(`Hello Trung Quan, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
//   });
// });
