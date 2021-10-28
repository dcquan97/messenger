/**
 * @param io from socket.io library
 */
let addNewContact = (io) => {
  io.on("connection", (socket) => {
    socket.on("add-new-contact", (data) =>{
      console.log(data);
      console.log(socket.require.user)
    });
  });
}

module.exports = addNewContact