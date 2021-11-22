function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function () {
    let fileData = $(this).prop("files")[0];
    let limit = 10485763*5; //byte = 5MB

    if (fileData.size > limit) {
      alertify.notify("Tệp tin đính kèm upload tối đa cho phép là 5MB.", "error", 7);
      $(this).val(null);
      return false;
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;

    let messageformData = new FormData();
    messageformData.append("my-attachment-chat", fileData);
    messageformData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageformData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-attachment",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageformData,
      success: function(data) {
        console.log(data);
      },
      error: function(error) {
        alertify.notify(error.responseText, "error", 7);
      }
    });
  });
}