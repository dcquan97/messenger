import mongoose from "mongoose";
import bluebird from "bluebird";

let connectDB = () => {
  mongoose.Promise = bluebird;
  // let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  let URI = `mongodb://dcqbean:gg1R3pjkHuzJnFwU@cluster0-shard-00-00.pti2l.mongodb.net:27017,cluster0-shard-00-01.pti2l.mongodb.net:27017,cluster0-shard-00-02.pti2l.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ev8rtj-shard-0&authSource=admin&retryWrites=true&w=majority`;
  return mongoose.connect(URI, {useMongoClient: true});
};

module.exports = connectDB;