import passportSocketIo from "passport.socketio";

let configSocketIo = (io, cookieParser, sessionStore) => {
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key:          process.env.SESSION_KEY,       // the name of the cookie where express/connect stores its session_id
    secret:       process.env.SESSION_SECRET,    // the session_secret to parse the cookie
    store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
    success: (data, accept) => {
      if (!data.user.logged_in) {
        return accept("Invalid user.", false);
      }
      return accept(null, true);
    },  // *optional* callback on success - read more below
    fail: (data, message, error, accept) => {
      if (error) {
        console.log("Failed connection to socket io:", message);
        return accept(new Error(message));
      }
    },     // *optional* callback on fail/error - read more below
  }));
};

module.exports = configSocketIo;