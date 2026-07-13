# Cấu hình gửi mật thư

Newsletter chỉ thông báo thành công sau khi nhà cung cấp email xác nhận gửi thành công.

## Cấu hình

1. Tạo tài khoản và xác minh miền gửi trên Resend.
2. Sao chép `frontend/.env.example` thành `frontend/.env`.
3. Điền `RESEND_API_KEY` và `NEWSLETTER_FROM_EMAIL`.
4. Khởi động website bằng `npm run dev` trong thư mục `frontend`.

Không đưa khóa API thật vào mã nguồn hoặc Git. Nếu chưa cấu hình, giao diện sẽ thông báo hệ thống email chưa sẵn sàng thay vì báo gửi thành công giả.
