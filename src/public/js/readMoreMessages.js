function readMoreMessages() {
  $(".right .chat").scroll(function() {
    if ($(this).scrollTop() === 0) {
      let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
      $(this).prepend(messageLoading);

      let targetId = $(this).data("chat");
      let skipMessage = $(this).find("div.bubble").length;
      let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

      $.get(`/message/read-more?skipMessage-${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
        console.log(data);
      });
    }
  });
}

$(document).ready(function() {
  readMoreMessages();
});