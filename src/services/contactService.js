import ContactModel from "./../models/contactModel";
import UsertModel from "./../models/userModel";
import _ from "lodash";

let findUserContact = (currentUserId, keyword) => {
  return new Promise((resolve, reject) => {
    let deprecatedUserIds = [];
    let contactsByUser = ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });

    deprecatedUserIds =  _.uniqBy(deprecatedUserIds);

  });
};

module.exports = {
  findUserContact: findUserContact
}