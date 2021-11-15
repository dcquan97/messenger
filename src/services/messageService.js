import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";

const LIMIT_CONVERSATION_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;


let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContact(currentUserId, LIMIT_CONVERSATION_TAKEN);

      let usersContactPromise = contacts.map( async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact;
        }
      });
      let userConversations = await Promise.all(usersContactPromise);
      let groupConversations = await ChatGroupModel.getChatGroup(currentUserId, LIMIT_CONVERSATION_TAKEN);
      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      });

      // get messages to apply in screen chat
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
        let getMessages = await MessageModel.model.getMessage(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);

        conversation = conversation.toObject();
        conversation.messages = getMessages;

        return conversation;
      });

      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);

      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return item.updatedAt;
      })

      resolve({
        userConversations : userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems,
}