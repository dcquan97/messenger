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

function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);
  video.srcObject = stream;
  video.onloadedata = function () {
    video.play();
  };
};

function closeVideoStream(stream) {
  return stream.getTracks().forEach(track => track.stop());
};

$(document).ready(function() {
  // Step 2 of caller
  socket.on("server-send-listener-is-offline", function() {
    alertify.notify("Người dùng này hiện đang không trực tuyến", "error", 7);
  });

  let getPeerId = "";
  const peer = new Peer({
    key: "peerjs",
    host: "peerjs-server-dtquan.herokuapp.com",
    secure: true,
    port: 443,
    // debug: 3
  });

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

        if (Swal.getContent().querySelector !== null) {
          Swal.showLoading();
          timeInterval = setInterval(() => {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
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
      },
      onClose: () => {
        clearInterval(timeInterval);
      }
    }).then((result) => {
      return false;
    });
  });

  let timeInterval;

  // Step 8 of listener
  socket.on("server-send-request-call-to-listener", function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };


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
      },
      onClose: () => {
        clearInterval(timeInterval);
      }
    }).then((result) => {
      return false;
    });
  });

   // Step 13 of caller
  socket.on("server-send-accept-call-to-caller", function(response) {
    Swal.close();
    clearInterval(timeInterval);
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    getUserMedia({video: true, audio: true}, function(stream) {
      // Show modal streaming
      $("#streamModal").modal("show");

      // Play my stream in local (of caller)
      playVideoStream("local-stream", stream);

      // Call to listener
      var call = peer.call(response.listenerPeerId, stream);

      // listen and play stream of listener
      call.on("stream", function(remoteStream) {
        // Show stream of listener
        playVideoStream("remote-stream", remoteStream);
      });

      // Close modal: remove stream
      $("#streamModal").on("hidden.bs.modal", function() {
        closeVideoStream(stream);
        Swal.fire({
          type: "info",
          title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ECC71;">${response.callerName}</span>`,
          backdrop: "rgba(85, 85, 85, 0.4)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Xác nhận"
        });
      });
    }, function(err) {
      if (err.toString() == "NotAllowedError: Permission denied") {
        alertify.notify("Xin lỗi, bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt, vui lòng mở lại trong phần cài đặt của trình duyệt.", "error", 7)
      };

      if (err.toString() == "NotFoundError: Requested device not found") {
        alertify.notify("Xin lỗi, không tìm thấy thiết bị nghe gọi trên máy tính của bạn.", "error", 7)
      };
    });
  });

  // Step 14 of listener
  socket.on("server-send-accept-call-to-listener", function(response) {
    Swal.close();
    clearInterval(timeInterval);
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    peer.on("call", function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
        // Show modal streaming
        $("#streamModal").modal("show");

        // Play my stream in local (of listener)
        playVideoStream("local-stream", stream);

        call.answer(stream); // Answer the call with an A/V stream.

        call.on("stream", function(remoteStream) {
          // Show stream of caller
          playVideoStream("remote-stream", remoteStream);
        });

        // Close modal: remove stream
        $("#streamModal").on("hidden.bs.modal", function() {
          closeVideoStream(stream);
        });
      }, function(err) {
        if (err.toString() == "NotAllowedError: Permission denied") {
          alertify.notify("Xin lỗi, bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt, vui lòng mở lại trong phần cài đặt của trình duyệt.", "error", 7)
        };

        if (err.toString() == "NotFoundError: Requested device not found") {
          alertify.notify("Xin lỗi, không tìm thấy thiết bị nghe gọi trên máy tính của bạn.", "error", 7)
        };
      });
    });
  })
});