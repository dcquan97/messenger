import express from "express";
import {home, auth} from "./../controllers/index";

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */
let initRoutes = (app) => {
  app.get("/", home.getHome);
  app.get("/login-register", auth.getLoginRegister);
  app.get("/logout", auth.getLogout);

  return app.use("/", router);
}

module.exports = initRoutes;