import mongoose from "mongoose";
import { contact } from "../services";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {type: Boolean, default: false},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findAllByUser(userId) {
    return this.find({
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();
  },

  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contacId": userId}
        ]}
      ]
    }).exec();
  },

  removeRequestContact(userId, contacId) {
    return this.removeById({
      $and: [
        {"userId": userId},
        {"contacId": contacId}
      ]
    }).exec();
  }
};

module.exports = mongoose.model("contact", ContactSchema)