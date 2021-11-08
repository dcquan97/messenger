import ContactModel from "./../models/contactModel";
import UsertModel from "./../models/userModel";

const LIMIT_CONVERSATION_TAKEN = 15;

let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContact(currentUserId, LIMIT_CONVERSATION_TAKEN);

      let usersContactPromise = contacts.map( async (contact) => {
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

module.exports = getAllConversationItems();