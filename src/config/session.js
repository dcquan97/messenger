import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);

/**
 * config session for app
 * This variable is where save session, in this case is mongodb
*/
let sessionStore = new MongoStore({
  url: process.env.DB_URI,
  autoReconnect: true,
  // autoRemove: "native"
});

/**
 * config session for app
 * @param app from exactly express module
*/
let config = (app) => {
  app.use(session({
    key:    process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store:  sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 86400000 seconds = 1 day
    }
  }));
};

module.exports = {
  config: config,
  sessionStore: sessionStore
};