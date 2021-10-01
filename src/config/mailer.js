import nodeMailer from "nodemailer";

let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;
let mailHost = process.env.MAIL_HOST;
let mailPort = process.env.MAIL_PORT;

let sendMail = (to, subject, htmlContent) => {
  let transport = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // use SSL - TLS
    auth: {
      user: adminEmail,
      password: adminPassword
    }
  });

  let options = {
    from: adminEmail,
    to: to,
    subject: subject,
    htmlContent: htmlContent
  };

};

module.exports = sendMail;