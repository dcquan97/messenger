function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function() {
    let TargetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId: TargetId,
      callerName: callerName
    };

    // Step 1 of Caller
    socket.emit("caller-check-listener-online-or-not", dataToEmit);

  });
};

$(document).ready(function() {
  // Step 2 of caller
  socket.on("server-send-listener-is-offline", function() {
    alertify.notify("Người dùng này hiện đang không trực tuyến", "error", 7);
  });

  let getPeerId = "";
  const peer = new Peer();
  peer.on("open", function(peerId) {
    getPeerId = peerId;
  })
  // Step 3 of listener
  socket.on("server-request-peer-id-of-listener", function(response) {
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId
    };

    // Step 4 of listener
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);
  })

  // Step 5 of caller
  socket.on("server-send-peer-id-of-listener-to-caller", function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    // Step 6 of caller
    socket.emit("caller-request-call-to-server", dataToEmit);
    let timeInterval ;
    Swal.fire({
      position: "top-end",
      title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">
          Huỷ cuộc gọi
        </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000, // 30 seconds
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click", function() {
          Swal.close();
          clearInterval(timeInterval);

          // Step 7 of caller
          socket.emit("caller-cancel-request-call-to-server", dataToEmit);
        });

        Swal.showLoading();
        timeInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      onOpen: () => {
        // Step 12 of caller
        socket.on("server-send-reject-call-to-caller", function(response) {
          Swal.close();
          clearInterval(timeInterval);

          Swal.fire({
            type: "info",
            title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; hiện tại không thể nghe máy.`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận"
          });
        });

        // Step 13 of caller
        socket.on("server-send-accept-call-to-caller", function(response) {
          Swal.close();
          clearInterval(timeInterval);
          console.log("Caller okieeee....")
        });
      },
      onClose: () => {
        clearInterval(timeInterval);
      }
    }).then((result) => {
      return false;
    });
  });

  // Step 8 of listener
  socket.on("server-send-request-call-to-listener", function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };

    let timeInterval ;
    Swal.fire({
      position: "top-end",
      title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; muốn trò chuyện video với bạn <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/><br/>
        <button id="btn-reject-call" class="btn btn-danger">
          Từ chối.
        </button>
        <button id="btn-accept-call" class="btn btn-success">
          Đồng ý.
        </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000, // 30 seconds
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click", function() {
          Swal.close();
          clearInterval(timeInterval);

          // Step 10 of listen
          socket.emit("listener-reject-request-call-to-server", dataToEmit);
        });

        $("#btn-accept-call").unbind("click").on("click", function() {
          Swal.close();
          clearInterval(timeInterval);

          // Step 11 of listen
          socket.emit("listener-accept-request-call-to-server", dataToEmit);
        });

        Swal.showLoading();
        timeInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      onOpen: () => {
        // Step 9 of listener
        socket.on("server-send-cancel-request-call-to-listener", function(response) {
          Swal.close();
          clearInterval(timeInterval);
        });
        // Step 14 of listener
        socket.on("server-send-accept-call-to-listener", function(response) {
          Swal.close();
          clearInterval(timeInterval);
          console.log("Listener okieeee....")
        })
      },
      onClose: () => {
        clearInterval(timeInterval);
      }
    }).then((result) => {
      return false;
    });
  });
});