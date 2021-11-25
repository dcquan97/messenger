import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);

/**
 * config session for app
 * This variable is where save session, in this case is mongodb
*/
let sessionStore = new MongoStore({
  url: `mongodb://dcqbean:gg1R3pjkHuzJnFwU@cluster0-shard-00-00.pti2l.mongodb.net:27017,cluster0-shard-00-01.pti2l.mongodb.net:27017,cluster0-shard-00-02.pti2l.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ev8rtj-shard-0&authSource=admin&retryWrites=true&w=majority`,
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