
import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";

let app = express();
// connect to mongodb
ConnectDB();

app.get("/test-database", async (req, res) => {
  try {
    let item = {
    userId: "123456",
    contactId: "12345776856",
    };
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  }
  catch (err) {
    console.log(err);
  }
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, () =>{
  console.log(`Hello Trung Quan, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}`);
});