export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com.",
  gender_incorrect: "Giới tính bị sai.",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chứ thường, số và ký tự đặc biệt.",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác.",
  update_username: "Tên người dùng phải từ 3-17 ký tự và không được chứa ký tự đặc biệt.",
  update_gender: "Oops! Lỗi hệ thống.",
  update_address: "Địa chỉ phải từ 3-30 ký tự.",
  update_phone: "Phải bắt đầu bằng số 0 và giới hạn trong khoảng 10-11 số.",
  keyword_find_user: "Lỗi từ khoá tìm kiếm, chỉ cho phép chữ cái, chữ số và khoảng trống.",
  message_text_emoji_incorrect: "Tin nhắn không hợp lệ. Đảm bảo tối thiểu 1 ký tự, tối đa 400 ký tự.",
  add_new_group_users_incorrect: "Vui lòng chọn bạn bè để thêm vào nhóm, tối thiểu 2 bạn bè.",
  add_new_group_name_incorrect: "Vui lòng đặt tên cho cuộc trò chuyện, giới hạn trong khoản 5-30 ký tự.",
};

export const transErrors = {
  account_in_use: "Email đã tồn tại.",
  account_remove: "Tài khoản này đã bị gỡ khỏi hệ thống, vui lòng liên hệ bộ phận hỗ trợ của chúng tôi.",
  account_not_active: "Vui lòng kiểm tra email để kích hoạt tài khoản.",
  login_failed: "Sai tài khoản hoặc mật khẩu.",
  server_error: "Lỗi hệ thống, vui lòng báo cho hỗ trợ của chúng tôi, xin cảm ơn!.",
  avatar_type: "File không hợp lệ, chỉ chấp nhận file png & jpg.",
  avatar_size: "Ảnh upload tối đa cho phép là 1MB.",
  account_undefined: "Tài khoản không tồn tại.",
  user_current_password_failed: "Mật khẩu hiện tại không chính xác.",
  conversation_not_found: "Cuộc trò chuyện không tồn tại.",
  image_message_type: "File không hợp lệ, chỉ chấp nhận file png & jpg.",
  image_message_size: "Ảnh upload tối đa cho phép là 1MB.",
  attachment_message_size: "Tệp tin đính kèm upload tối đa cho phép là 5MB.",
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được đăng ký thành công, vui lòng kiểm tra email để kích hoạt tài khoản, Xin cảm ơn!`;
  },

  account_active: "Tài khoản đã được kích hoạt thành công.",
  loginSuccess: (username) => {
    return `Xin chào ${username}, chúc bạn một ngày tốt lành.`
  },

  logout_success: "Đăng xuất tài khoản thành công.",
  // avatar_updated: "Cập nhật ảnh đại diện thành công.",
  user_info_updated: "Cập nhật thông tin thành công.",
  user_password_updated: "Cập nhật mật khẩu thành công."
};

export const transMail = {
  subject: "Awesome Chat: Xác nhận kích hoạt tài khoản.",
  template: (linkVerify) => {
    return `
      <h2>Bạn nhận được email này vì đã đăng ký tài khoản trên ứng dụng Awesome Chat. </h2>
      <h3>Vui lòng click vào liên kết bên dưới để kích hoạt tài khoản.</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Bỏ qua email này nếu người đăng ký tài khoản không phải là bạn.</h4>
    `;
  },
  send_falsed: "Có lỗi trong quá trình gửi email, vui lòng liên hệ với hỗ trợ."
};
