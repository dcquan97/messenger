/**
 * @param io from socket.io library
 */
let addNewContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {

    // push socket id to array
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

      // emit notification
      if (clients[data.contactId]) {
        clients[data.contactId].forEach(socketId => {
          io.to(socketId).emit("response-add-new-contact", currentUser);
        });
      };
    });

    socket.on("disconnect", () => {
      // remove socket id when socket disconected
      clients[currentUserId] = clients[currentUserId].filter(socketId =>  socketId !== socket.id );
      if (!clients[currentUserId].length) {
        delete clients[currentUserId];
      };
    });
  });
}

module.exports = addNewContact;