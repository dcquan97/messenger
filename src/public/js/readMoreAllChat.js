$(document).ready(function() {
  $("#link-read-more-all-chat").bind("click", function() {
    let skipPersional = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;

    $("#link-read-more-all-chat").css("display", "none");
    $(".read-more-all-chat-loader").css("display", "inline-block");


    $.get(`/message/read-more-all-chat?skipPersional=${ skipPersional }&skipGroup=${ skipGroup }`, function(data) {
      if (data.leftSideData.trim() === "") {
        alertify.notify("Bạn không còn cuộc trò chuyện nào để xem.", "error", 7);
        $("#link-read-more-all-chat").css("display", "block");
        $(".read-more-all-chat-loader").css("display", "none");
        return false;
      }

      // Step 1: handle leftSide
      $("#all-chat").find("ul").append(data.leftSideData);

      // Step 2: handle scroll left
      resizeNiceScrollLeft();
      niceScrollLeft();

      // Step 3: handle rightSide
      $("#screen-chat").append(data.rightSideData);

      // Step 4: call function Screen chat
      changeScreenChat();

      // Step 5: convert emoji
      convertEmoji();

      // Step 6: handle imageModal
      $("body").append(data.imageModalData);

      // Step 7: call function gridPhotos
      gridPhotos(5);

      // Step 8: handle attachmentsModal
      $("body").append(data.attachmentsModal);

      // Step 9: update online
      socket.emit("check-status");

      // Step 10: remove loading
      $("#link-read-more-all-chat").css("display", "block");
      $(".read-more-all-chat-loader").css("display", "none");

      // Step 11: call readMoreMessages
      readMoreMessages();

    });
  });
});