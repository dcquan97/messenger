let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo() {
  $("#input-change-avatar").bind("change", function() {
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

    if (typeof (FileReader) != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>", {
          "src": element.target.result,
          "class": "avatar img-circle",
          "alt": "avatar",
          "id": "user-modal-avatar"
        }).appendTo(imagePreview);
      }

      imagePreview.show();
      fileReader.readAsDataURL(fileData);
    } else {
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader.")
    }
  });

  $("#input-change-username").bind("change", function() {
    userInfo.username = $(this).val();
  });

  $("#input-change-gender-male").bind("click", function () {
    userInfo.gender = $(this).val();
  });

  $("#input-change-gender-female").bind("click", function() {
    userInfo.gender = $(this).val();
  });

  $("#input-change-address").bind("change", function() {
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change", function() {
    userInfo.phone = $(this).val();
  });
}

$(document).ready(function() {
  updateUserInfo();

  originAvatarSrc = $("#user-modal-avatar").attr("src");

  $("#input-btn-update-user").bind("click", function() {
    if($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Không có thông tin mới cần cập nhật.", "error", 7);
      return false;
    }
    $.ajax({
      url: "/user/update-avatar",
      type: "put",
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function(result) {
        //
      },
      errors: function(result) {
        //
      }
    });
    // console.log(userAvatar);
    // console.log(userInfo);
  });

  $("#input-btn-cancel-update-user").bind("click", function() {
    userAvatar = null;
    userInfo = {};
    $("#user-modal-avatar").attr("src", originAvatarSrc);
  });
});