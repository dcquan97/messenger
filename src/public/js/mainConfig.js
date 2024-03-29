/**
 */

const socket = io();

function niceScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function resizeNiceScrollLeft() {
  $(".left").getNiceScroll().resize();
}

function niceScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        // Gắn giá trị thay đổi vào thẻ input đã bị ẩn
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function() {
        // Bật lắng nghe DOM cho việc chat tin nhắn văn bản + emoji
        textAndEmojiChat(divId);
        typingOn(divId);
      },
      blur: function() {
        // Tắt lắng nghe DOM cho việc chat tin nhắn văn bản + emoji
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $('.main-content').click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind('click').on('click', function() {
    let href = $(this).attr('href');
    let modalImagesId = href.replace("#", "");

    let originDataImage = $(`#${modalImagesId}`).find("div.modal-body").html();

    let countRows = Math.ceil($(`#${modalImagesId}`).find('div.all-images>img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");

    $(`#${modalImagesId}`).find('div.all-images').photosetGrid({
      highresLinks: true,
      rel: 'withhearts-gallery',
      gutter: '2px',
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImagesId}`).find('.all-images').css({
          'visibility': 'visible'
        });
        $(`#${modalImagesId}`).find('.all-images a').colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: '90%',
          maxWidth: '90%'
        });
      }
    });
    // Bắt sự kiện đóng modal
    $(`#${modalImagesId}`).on("hidden.bs.modal", function() {
      $(this).find('div.modal-body').html(originDataImage);
    });
  });

}

function showButtonGroupChat() {
  $('#select-type-chat').bind('change', function() {
    if ($(this).val() === 'group-chat') {
      $('.create-group-chat').show();
      // Do something...
    } else {
      $('.create-group-chat').hide();
    }
  });
}

function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 7);
  }
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function() {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    }
  });
}

function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function() {
    let divId = $(this).find("li").data("chat");

    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");

    $(this).tab("show");

    // Cấu hình thanh cuộn bên box chat rightSide.ejs mỗi khi click chuột vào cuộc trò chuyện cụ thể
    niceScrollRight(divId);

    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);

    // Bật lắng nghe DOM cho việc nhắn tin hình ảnh
    imageChat(divId);

    // Bật lắng nghe DOM cho việc nhắn tin tệp đính kèm
    attachmentChat(divId);

    // Bật lắng nghe DOM cho việc call video chat
    videoChat(divId);
  });
}

function convertEmoji() {
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
}

function bufferToBase64(buffer) {
  return btoa( new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

//extras
function notYetConversated() {
  if (!$("ul.people").find("a").length) {
    Swal.fire({
      title: "Bạn chưa có bạn bè? Hãy tìm kiếm bạn bè để trò chuyện!",
      type: "info",
      showCancelButton: false,
      confirmButtonColor: "#2ECC71",
      confirmButtonText: "Xác nhận",
    }).then((result) => {
      $("#contactsModal").modal("show");
    })
  }
}

function userTalk() {
  $(".user-talk").unbind("click").on("click", function(){
    let dataChat = $(this).data("uid");
    $("ul.people").find(`a[href="#uid_${dataChat}"]`).click();
    $(this).closest("div.modal").modal("hide");
  });
}

function zoomImageChat() {
  $(".show-image-chat").unbind("click").on("click", function() {
    $("img-chat-modal").css("display", "block");
    $("img-chat-modal-content").attr("src", $(this)[0].src);

    $("#img-chat-modal").on("click", function() {
      $(this).css("display", "none");
    });
  });
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  niceScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị button mở modal tạo nhóm trò chuyện
  showButtonGroupChat();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Flash messages ở màn hình master
  flashMasterNotify();

  // Thay đổi kiểu trò chuyện
  changeTypeChat();

  // Thay đổi màn hình chat
  changeScreenChat();

  // Convert unicode thành hình ảnh
  convertEmoji();

  // Click vào phần tử đầu tiên của cuộc trò chuyện khi load trang web
  if ($("ul.people").find("a").length) {
    $("ul.people").find("a")[0].click();
  }

  $("#video-chat-group").bind("click", function() {
    alertify.notify("Tính năng này không khả dụng với nhóm trò chuyện. Vui lòng thử lại với trò chuyện cá nhân.", "error", 7)
  });

  notYetConversated();
  userTalk();
  zoomImageChat()
});
