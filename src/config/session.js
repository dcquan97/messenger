import session from "express-session";

/**
 * config session for app
 * @param app from exactly express module
*/
let configSessions = (app) => {
  app.use(session({
    key: "express.sid",
    secret: "mySecret",
    // store:
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 86400000 seconds = 1 day
    }
  }))
};

module.exports = configSessions;