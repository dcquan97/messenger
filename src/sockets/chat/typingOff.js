import { pushSocketIdToArray, emitNofifyToArray, removeSocketIdToArray} from "./../../helpers/socketHelper.js"

/**
 * @param io from socket.io library
 */
let typingOff = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    // push socket id to array
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    // When has new group chat
    socket.on("new-group-created", (data) =>{
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });
    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on("user-is-not-typing", (data) =>{
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
        };
        if (clients[data.groupId]) {
          emitNofifyToArray(clients, data.groupId, io, "response-user-is-not-typing", response);
        };
      }
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
        };
        if (clients[data.contactId]) {
          emitNofifyToArray(clients, data.contactId, io, "response-user-is-not-typing", response);
        };
      }
    });

    // remove socket id when socket disconected
    socket.on("disconnect", () => {
      clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdToArray(clients, group._id, socket);
      });
    });
  });
}

module.exports = typingOff;