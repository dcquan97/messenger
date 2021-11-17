import {notification, contact, message} from "./../services/index";
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helpers/clientHelper";


let getHome = async (req, res) => {
  // only 10 items one time
  let notifications = await notification.getNotifications(req.user._id);

  // get amount notifications unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // get contacts 10 item one time
  let contacts = await contact.getContact(req.user._id);

  // get contacts sent 10 item one time
  let contactsSent = await contact.getContactSent(req.user._id);

  // get contacts receivied 10 item one time
  let contactsReceived = await contact.getContactReceived(req.user._id);

  // count contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);

  // count contacts sent
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);

  // count contacts received
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);

  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
    getAllConversationItems: getAllConversationItems,
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimestampToHumanTime: convertTimestampToHumanTime
  });
};

module.exports = {
  getHome: getHome
};
