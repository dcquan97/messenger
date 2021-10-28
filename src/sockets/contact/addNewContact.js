/**
 * @param io from socket.io library
 */
let addNewContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    let currentUserId = socket.request.user._id;

    if (clients[currentUserId]) {
      clients[currentUserId].push(socket.id);
    } else {
      clients[currentUserId] = [socket.id];
    }

    socket.on("add-new-contact", (data) =>{
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar
      };

      io.sockets.emit("response-add-new-contact", currentUser);
    });
  });
}

module.exports = addNewContact;