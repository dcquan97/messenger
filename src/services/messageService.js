import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";

const LIMIT_CONVERSATION_TAKEN = 15;

let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContact(currentUserId, LIMIT_CONVERSATION_TAKEN);

      let usersContactPromise = contacts.map( async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });
      let userConversations = await Promise.all(usersContactPromise);
      let groupConversations = await ChatGroupModel.getChatGroup(currentUserId, LIMIT_CONVERSATION_TAKEN);

      console.log(userConversations);
      console.log("-------------------");
      console.log(groupConversations);

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems,
}