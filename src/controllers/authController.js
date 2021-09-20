import {validationResult} from "express-validator/check";

let getLoginRegister = (req, res) => {
  return res.render("auth/master");
};

let postRegister = (req, res) => {
  console.log(validationResult(req).isEmpty());
  console.log("-------------------------------");
  console.log(validationResult(req).mapped());
};

module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister
};