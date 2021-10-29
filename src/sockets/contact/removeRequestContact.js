/**
 * @param io from socket.io library
 */
 let removeRequestContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {

    // push socket id to array
    let currentUserId = socket.request.user._id;
    if (clients[currentUserId]) {
      clients[currentUserId].push(socket.id);
    } else {
      clients[currentUserId] = [socket.id];
    }

    socket.on("remove-request-contact", (data) =>{
      let currentUser = {
        id: socket.request.user._id
      };

      // emit notification
      if (clients[data.contactId]) {
        clients[data.contactId].forEach(socketId => {
          io.to(socketId).emit("response-remove-request-contact", currentUser);
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

module.exports = removeRequestContact;