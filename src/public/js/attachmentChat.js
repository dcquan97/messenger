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
        let dataToEmit = {
          message: data.message
        };

        // Step 1: handle message data before show
        let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
        let attachmentChat = `<a href="data:${ data.message.file.contentType }; base64, ${ bufferToBase64(data.message.file.data.data) }" download="${ bufferToBase64(data.message.file.fileName) }">
            ${ data.message.file.fileName }
        </a>`;

        if (isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />` ;
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);

          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else {
          messageOfMe.html(attachmentChat);
          dataToEmit.contactId = targetId;
        }

        // Step 2: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        niceScrollRight(divId);

        // Step 3: remove all data at input: nothing to code.

        // Step 4: change data preview & time in leftSide
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

        // Step 5: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("dcqbean.moveConversationToTheTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("dcqbean.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("dcqbean.moveConversationToTheTop");

        // Step 6: Emit realtime
        socket.emit("chat-attachment", dataToEmit);

        // Step 7: Emit remove typing realtime: nothing to code.
        // Step 8: If this has typing, remove that immediate: nothing to code.

        // Step 9: Add to modal attachment
        let attachmentChatToAddModal = `
        <li>
          <a href="data:${ data.message.file.contentType }; base64, ${ bufferToBase64(data.message.file.data.data) }" download="${ data.message.file.fileName }">
            ${ data.message.file.fileName }
          </a>
        </li>`;
        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
      },
      error: function(error) {
        alertify.notify(error.responseText, "error", 7);
      }
    });
  });
}

$(document).ready(function() {
  socket.on("response-chat-attachment", function(response) {
    let divId = "";
    // Step 1: handle message data before show
    let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
    messageOfYou.text(response.message.text);
    let attachmentChat = `<a href="data:${ response.message.file.contentType }; base64, ${ bufferToBase64(response.message.file.data.data) }" download="${ bufferToBase64(response.message.file.fileName) }">
        ${ response.message.file.fileName }
    </a>`;
    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />` ;
      messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
      divId = response.currentGroupId;
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(attachmentChat);
      divId = response.currentUserId;
    }

    // Step 2: append message data to screen
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      niceScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    // Step 3: remove all data at input: nothing to code.

    // Step 4: change data preview & time in leftSide
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

    // Step 5: move conversation to the top
    $(`.person[data-chat=${divId}]`).on("dcqbean.moveConversationToTheTop", function() {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("dcqbean.moveConversationToTheTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("dcqbean.moveConversationToTheTop");

    // Step 6: Emit realtime: nothing to code
    // Step 7: Emit remove typing realtime: nothing to code.
    // Step 8: If this has typing, remove that immediate: nothing to code.

    // Step 9: Add to modal image
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let attachmentChatToAddModal = `
        <li>
          <a href="data:${ response.message.file.contentType }; base64, ${ bufferToBase64(response.message.file.data.data) }" download="${ response.message.file.fileName }">
            ${ response.message.file.fileName }
          </a>
        </li>`;
        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
    }
  });
});