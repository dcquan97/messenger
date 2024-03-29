import {validationResult} from "express-validator/check";
import {app} from "./../config/app";
import {transErrors, transSuccess} from "./../../lang/vi";
import {message} from "./../services/index";
import multer from "multer";
import fsExtra from "fs-extra";
import ejs from "ejs";
import {lastItemOfArray, convertTimestampToHumanTime, bufferToBase64} from "./../helpers/clientHelper";
import {promisify} from "util";

// Make ejs function renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind();

// Handle text and emoji chat
let addNewTextEmoji = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach( item => {
      errorArr.push(item.msg);
    });

    return res.status(500).send(errorArr);
  }

  try {
    let sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar,
    };

    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

    return res.status(200).send({message: newMessage});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },
  filename: (req, file, callback) => {
    let math = app.image_message_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.image_message_type, null);
    }

    let imageName = `${file.originalname}`;
    callback(null, imageName);
  }
});

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: {fileSize: app.image_message_limit_size}
}).single("my-image-chat");

let addNewImage = (req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if(error) {
      if(error.message) {
        return res.status(500).send(transErrors.image_message_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      };

      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;

      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);

      // remove image, because this image is saved to mongodb
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`)

      return res.status(200).send({message: newMessage});
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

let storageAttachmentChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.attachment_message_directory);
  },
  filename: (req, file, callback) => {

    let attachmentName = `${file.originalname}`;
    callback(null, attachmentName);
  }
});

let attachmentMessageUploadFile = multer({
  storage: storageAttachmentChat,
  limits: {fileSize: app.attachment_message_limit_size}
}).single("my-attachment-chat");


let addNewAttachment = (req, res) => {
  attachmentMessageUploadFile(req, res, async (error) => {
    if(error) {
      if(error.message) {
        return res.status(500).send(transErrors.attachment_message_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      };

      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;

      let newMessage = await message.addNewAttachment(sender, receiverId, messageVal, isChatGroup);

      // remove attachment, because this imattachmentage is saved to mongodb
      await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`)

      return res.status(200).send({message: newMessage});
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

let readMoreAllChat = async (req, res) => {
  try {
    let skipPersional = +(req.query.skipPersional);

    let skipGroup = +(req.query.skipGroup);

    let newAllConversations = await message.readMoreAllChat(req.user._id, skipPersional, skipGroup);

    let dataToRender = {
      newAllConversations: newAllConversations,
      convertTimestampToHumanTime: convertTimestampToHumanTime,
      lastItemOfArray: lastItemOfArray,
      bufferToBase64: bufferToBase64,
      user: req.user
    };

    let leftSideData = await renderFile("src/views/main/readMoreConversations/_leftSide.ejs", dataToRender);
    let rightSideData = await renderFile("src/views/main/readMoreConversations/_rightSide.ejs", dataToRender);
    let imageModalData = await renderFile("src/views/main/readMoreConversations/_imageModal.ejs", dataToRender);
    let attachmentsModalData = await renderFile("src/views/main/readMoreConversations/_attachmentsModal.ejs", dataToRender);


    return res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModalData: imageModalData,
      attachmentsModalData: attachmentsModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMore = async (req, res) => {
  try {
    let skipMessage = +(req.query.skipMessage);
    let targetId = (req.query.targetId);
    let chatInGroup = (req.query.chatInGroup === "true");

    let newMessages = await message.readMore(req.user._id, skipMessage, targetId, chatInGroup);

    // get more item
    let dataToRender = {
      newMessages: newMessages,
      bufferToBase64: bufferToBase64,
      user: req.user
    };

    let rightSideData = await renderFile("src/views/main/readMoreMessages/_rightSide.ejs", dataToRender);
    let imageModalData = await renderFile("src/views/main/readMoreMessages/_imageModal.ejs", dataToRender);
    let attachmentsModalData = await renderFile("src/views/main/readMoreMessages/_attachmentsModal.ejs", dataToRender);

    return res.status(200).send({
      rightSideData: rightSideData,
      imageModalData: imageModalData,
      attachmentsModalData: attachmentsModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllChat: readMoreAllChat,
  readMore: readMore
}