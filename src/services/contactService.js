import ContactModel from "./../models/contactModel";
import UsertModel from "./../models/userModel";
import NotificationModel from "./../models/notificationModel";
import _ from "lodash";

const LIMIT_NUMBER_TAKEN = 10;

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

let removeRequestContactSent = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    }
    // remove notification
    await NotificationModel.model.removeRequestContactSentNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
};

let removeRequestContactReceived = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
    if (removeReq.result.n === 0) {
      return reject(false);
    }
    // remove notification
    // await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, NotificationModel.types.ADD_CONTACT);
    resolve(true);
  });
};

let getContact = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContact(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map( async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UsertModel.getNormalUserDataById(contact.userId);
        } else {
          return await UsertModel.getNormalUserDataById(contact.contactId);
        }
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactSent(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map( async (contact) => {
        return await UsertModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let getContactReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactReceived(currentUserId, LIMIT_NUMBER_TAKEN);

      let users = contacts.map( async (contact) => {
        return await UsertModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);

      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsSent(currentUserId);

      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let countAllContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsReceived(currentUserId);

      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);

      let users = newContacts.map( async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UsertModel.getNormalUserDataById(contact.userId);
        } else {
          return await UsertModel.getNormalUserDataById(contact.contactId);
        };
      });

      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsSent = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.readMoreContactsSent(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);

      let users = contacts.map( async (contact) => {
        return await UsertModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsReceived = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.readMoreContactsReceived(currentUserId, skipNumberContacts, LIMIT_NUMBER_TAKEN);

      let users = contacts.map( async (contact) => {
        return await UsertModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUserContact: findUserContact,
  addNew: addNew,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  getContact: getContact,
  getContactSent: getContactSent,
  getContactReceived: getContactReceived,
  countAllContacts: countAllContacts,
  countAllContactsSent: countAllContactsSent,
  countAllContactsReceived: countAllContactsReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived
};
