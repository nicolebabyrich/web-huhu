# Defect log tổng hợp - AN Store

Tài liệu này chỉ giữ các nhóm lỗi quan trọng cần kiểm soát trong quá trình nghiệm thu. Các lỗi nhỏ theo từng lần test đã được tổng hợp thành nhóm, không lưu toàn bộ nhật ký vụn vặt.

## Trạng thái hiện tại

| Nhóm lỗi | Mô tả | Trạng thái |
|---|---|---|
| Validation form | Email, SĐT, mật khẩu, ngày sinh, địa chỉ giao hàng cần báo lỗi trực tiếp tại trường | Đã xử lý, cần kiểm thử hồi quy |
| UI spacing/font | Một số khu vực từng bị dính dòng, chữ nhỏ, rớt chữ hoặc lệch button | Đã xử lý nhiều vòng, cần kiểm thử responsive |
| Giỏ hàng/checkout | Cần đảm bảo thêm giỏ, xem giỏ, voucher, QR, COD, hóa đơn hoạt động nhất quán | Đã xử lý, cần test end-to-end |
| Tồn kho | Không trừ kho khi thêm giỏ; chỉ trừ sau thanh toán/đặt hàng thành công theo logic mock | Đã xử lý, cần test đơn hàng/hủy đơn |
| Admin dashboard | Cần dashboard có ý nghĩa thống kê, spacing cân đối, hover chart rõ | Đã xử lý, cần test hiển thị dữ liệu |
| Đổi/trả và đánh giá | Bố cục form, upload optional, lý do từ chối của admin | Đã xử lý, cần test user-admin đối ứng |
| Blog | User gửi bài chờ duyệt, admin duyệt bài, validate nội dung | Đã xử lý, cần test luồng đầy đủ |
| Asset 3D/video/QR | Mô hình 3D, video demo, QR phải hiển thị trên web, không ép tải file | Đã xử lý, cần test trên server dự án |

## Lỗi cần chú ý khi test cuối

1. Mở website bằng server dự án để asset `.glb` có MIME đúng.
2. Sau mỗi lần sửa CSS, kiểm tra lại các điểm dễ rớt chữ: product card, category card, footer, checkout step title, admin table.
3. Sau mỗi lần sửa data, kiểm tra lại tiếng Việt để tránh lỗi encoding.
4. Sau mỗi lần dọn repo, kiểm tra lại đường dẫn ảnh, QR, video, mô hình 3D.

## Kết luận QA

Bộ lỗi chi tiết theo từng vòng test không cần giữ trong repo nộp chính thức. Repo chỉ nên giữ test case chính thức, defect log tổng hợp và ảnh so sánh giao diện nếu cần minh chứng.
