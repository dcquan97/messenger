import mongoose from "mongoose";
import bluebird from "bluebird";

let connectDB = () => {
  mongoose.Promise = bluebird;
  // mongodb://localhost:27017/awesome_chat
  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  // let URI = `mongodb://localhost:27017/awesome_chat`
  return mongoose.connect(URI, {useMongoClient: true});
};

module.exports = connectDB;