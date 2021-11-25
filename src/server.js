require('dotenv').config();

import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import bodyParser from "body-parser";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";
import events from "events";
import * as configApp from "./config/app";

// Init app
let app = express();

// Set max connection event listeners
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;

// Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// Connect to mongodb
ConnectDB();

// Config session

session.config(app);

// Config viewengine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// Enable flash message
app.use(connectFlash());

// Use cookieParser
app.use(cookieParser());

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

// Config routes
initRoutes(app);

// Config socket.io
configSocketIo(io, cookieParser, session.sessionStore);

// Init all sockets
initSockets(io);

// server.listen(process.env.PORT, process.env.APP_HOST, () =>{
//   console.log(`Hello Trung Quan, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
// });

server.listen(process.env.PORT || 3000, () =>{
  console.log(`Hello Trung Quan, I'm running at ${process.env.PORT}`);
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
