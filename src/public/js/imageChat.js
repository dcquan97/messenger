function imageChat(divId) {
  $(`image-chat-${divId}`).unbind("change", function() {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpeg", "image/jpg"];
    let limit = 10485763; //byte = 1MB

    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify("File không hợp lệ, chỉ chấp nhận file png & jpg.", "error", 7);
      $(this).val(null);
      return false;
    }
    if (fileData.type > limit) {
      alertify.notify("Ảnh upload tối đa cho phép là 1MB.", "error", 7);
      $(this).val(null);
      return false;
    }

    let targetId = $(this).data("chat");

    let messageformData = new FormData();
    messageformData.append("my-image-chat", fileData);
    messageformData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageformData.append("isChatGroup", true);
    }

    $.ajax({
      url: "/message/add-new-image",
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