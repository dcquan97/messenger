import { pushSocketIdToArray, emitNofifyToArray, removeSocketIdToArray} from "./../../helpers/socketHelper.js"

/**
 * @param io from socket.io library
 */
let addNewContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on("add-new-contact", (data) =>{
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      };

      // emit notification
      if (clients[data.contactId]) {
        emitNofifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser);
      };
    });

    // remove socket id when socket disconected
    socket.on("disconnect", () => {
      clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
    });
  });
}

module.exports = addNewContact;