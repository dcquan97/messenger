import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import connectFlash from "connect-flash";
import bodyParser from "body-parser";
import configSession from "./config/session";
import passport from "passport";

import pem from "pem";
import https from "https";
require('dotenv').config();

pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
  if (err) {
    throw err;
  }
  // Init app
  let app = express();

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

  https.createServer({ key: keys.clientKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
    console.log(`Hello Trung Quan, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
  });
});


// // Init app
// let app = express();

// // connect to mongodb
// ConnectDB();

// // Config session

// configSession(app);

// // config viewengine
// configViewEngine(app);

// // Enable post data for request
// app.use(bodyParser.urlencoded({ extended: true }));

// // Enable flash message
// app.use(connectFlash());

// // Config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// //config routes
// initRoutes(app);

// app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
//   console.log(`Hello Trung Quan, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
// });
