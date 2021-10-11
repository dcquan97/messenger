import express from "express";
import {home, auth} from "./../controllers/index";
import {authValid} from "./../validation";

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */
let initRoutes = (app) => {
  app.get("/", home.getHome);
  app.get("/login-register", auth.getLoginRegister);
  app.post("/register", authValid.register, auth.postRegister);
  app.get("/verify/:token", auth.verifyAccount);

  return app.use("/", router);
}

module.exports = initRoutes;