export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com.",
  gender_incorrect: "Giới tính bị sai.",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chứ thường, số và ký tự đặc biệt.",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác."
};

export const transErrors = {
  account_in_use: "Email đã tồn tại.",
  account_remove: "Tài khoản này đã bị gỡ khỏi hệ thống, vui lòng liên hệ bộ phận hỗ trợ của chúng tôi.",
  account_not_active: "Vui lòng kiểm tra email để kích hoạt tài khoản."
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được đăng ký thành công, vui lòng kiểm tra email để kích hoạt tài khoản, Xin cảm ơn!`
  }
}