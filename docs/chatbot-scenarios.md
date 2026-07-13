# Kịch bản chatbot Thư Đồng

## Mục tiêu
Thư Đồng hỗ trợ khách hàng trên website ẨN Store bằng tiếng Việt, tập trung vào tư vấn sản phẩm, hướng dẫn mua hàng, tài khoản, đơn hàng, giao nhận và đổi trả. Chatbot không yêu cầu mật khẩu, OTP, số thẻ hoặc thông tin thanh toán nhạy cảm.

## Nhóm câu hỏi cơ bản

### 1. Tư vấn sản phẩm
- Khách hỏi: "Người mới chơi nên mua bộ nào?"
- Hướng xử lý: hỏi số người chơi, độ tuổi, thời lượng mong muốn; gợi ý xem trang Sản phẩm hoặc sản phẩm ẨN: Mật Án Lệ Chi Viên.

### 2. Hướng dẫn mua hàng
- Khách hỏi: "Làm sao để đặt hàng?"
- Hướng xử lý: xem sản phẩm -> thêm vào giỏ -> đăng nhập -> chọn địa chỉ -> áp voucher nếu có -> xác nhận thanh toán demo.

### 3. Giỏ hàng và tồn kho
- Khách hỏi: "Sao không thêm được sản phẩm?"
- Hướng xử lý: nhắc kiểm tra trạng thái hết hàng, số lượng chọn và giỏ hàng; không khẳng định tồn kho nếu không có dữ liệu hiển thị.

### 4. Đơn hàng
- Khách hỏi: "Tôi xem đơn ở đâu?"
- Hướng xử lý: hướng dẫn vào mục Đơn hàng, xem trạng thái, chi tiết và yêu cầu hủy nếu còn điều kiện.

### 5. Giao nhận
- Khách hỏi: "Bao lâu nhận hàng?"
- Hướng xử lý: TP. HCM 1-3 ngày làm việc; liên tỉnh 3-4 ngày làm việc; đơn trên 500.000 VNĐ miễn phí vận chuyển; cấp tốc TP. HCM 50.000 VNĐ.

### 6. Đổi trả và bảo hành
- Khách hỏi: "Tôi muốn đổi/trả hàng"
- Hướng xử lý: đổi trả trong 03 ngày nếu lỗi/nhầm hàng và còn hóa đơn; hướng dẫn liên hệ hotline 090-XXX-XXXX hoặc matan@anstore.vn.

### 7. Tài khoản và quên mật khẩu
- Khách hỏi: "Quên mật khẩu thì sao?"
- Hướng xử lý: hướng dẫn dùng luồng quên mật khẩu demo; nhắc email thực tế không được gửi trong phạm vi đồ án.

### 8. Audio sang text
- Khách tải file âm thanh trong chatbot.
- Hướng xử lý: mô-đun Tư Duy dùng Gemini để chuyển audio thành văn bản, điền vào ô nhập, khách kiểm tra rồi bấm Gửi.