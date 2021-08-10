
import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";

// Init app
let app = express();

// connect to mongodb
ConnectDB();

// config viewengine
configViewEngine(app);

app.get("/", async (req, res) => {
  return res.render("main/master")
});

app.get("/login-register", async (req, res) => {
  return res.render("auth/loginRegister")
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
  console.log(`Hello Trung Quan, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
});