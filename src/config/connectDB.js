import mongoose from "mongoose";
import bluebird from "bluebird";

let connectDB = () => {
  mongoose.Promise = bluebird;
  // let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  let URI = `mongodb+srv://dcqbean:12323qweqweQ@cluster0.pti2l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  return mongoose.connect(URI, {useMongoClient: true});
};

module.exports = connectDB;