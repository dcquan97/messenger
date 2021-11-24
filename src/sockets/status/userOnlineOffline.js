import { pushSocketIdToArray, emitNofifyToArray, removeSocketIdToArray} from "./../../helpers/socketHelper.js"

/**
 * @param io from socket.io library
 */
let userOnlineOffline = (io) => {
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

    let listUserOnline = Object.keys(clients);
    // Step 1: Emit to user after login or f5 web page
    socket.emit("server-send-list-users-online", listUserOnline);

    // Step 2: Emit to all another users when has new user online
    socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);

    // remove socket id when socket disconected
    socket.on("disconnect", () => {
      clients = removeSocketIdToArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdToArray(clients, group._id, socket);
      });

      // Step 3: Emit to all another users when has new user offline
      socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
    });
  });
}

module.exports = userOnlineOffline;