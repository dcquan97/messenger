import ContactModel from "./../models/contactModel";
import UsertModel from "./../models/userModel";
import NotificationModel from "./../models/notificationModel";
import _ from "lodash";

let findUserContact = (currentUserId, keyword) => {
  return new Promise( async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
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

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(currentUserId, contactId);
    if (contactExists) {
      return reject(false);
    };
    // create contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };

    let newContact = await ContactModel.createNew(newContactItem);

    // create notification
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.ADD_CONTACT,
    };

    await NotificationModel.model.createNew(notificationItem);

    resolve(newContact);
  });
};

let removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    }
    // remove notification
    await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
};

module.exports = {
  findUserContact: findUserContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact
}
