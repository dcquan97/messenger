function removeRequestContact() {
  $(".user-remove-request-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "remove-request",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
        $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
      }
    });
  });
};