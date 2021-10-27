import ContactModel from "./../models/contactModel";
import UsertModel from "./../models/userModel";
import _ from "lodash";

let findUserContact = (currentUserId, keyword) => {
  return new Promise( async (resolve, reject) => {
    let deprecatedUserIds = [];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });

    deprecatedUserIds =  _.uniqBy(deprecatedUserIds);
    let users = await UsertModel.findAllForAddContact(deprecatedUserIds, keyword)
    resolve(users);
  });
};

module.exports = {
  findUserContact: findUserContact
}
