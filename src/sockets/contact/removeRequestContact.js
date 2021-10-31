import { pushSocketIdToArray, emitNofifyToArray, removeSocketIdToArray} from "./../../helpers/socketHelper.js"

/**
 * @param io from socket.io library
 */
 let removeRequestContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    // emit notification
    socket.on("remove-request-contact", (data) =>{
      let currentUser = { id: socket.request.user._id };
      if (clients[data.contactId]) {
        emitNofifyToArray(clients, data.contactId, io, "response-remove-request-contact", currentUser);
      };
    });

    // remove socket id when socket disconected
    socket.on("disconnect", () => {
      clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
    });
  });
}

module.exports = removeRequestContact;