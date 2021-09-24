import {validationResult} from "express-validator/check";

let getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    error: req.flash("errors")
  });
};

let postRegister = (req, res) => {
  let errorArr = [];

  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.value(validationErrorss.mapped());
    errors.forEach( item => {
      errorArr.push(item.msg);
    });

    req.flash("errors", errorArr);
    return res.redirect("/login-register")
  }
  console.log(req.body);
};

module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister
};