# Tổng quan dự án ẨN Store

## 1. Giới thiệu

ẨN Store là website thương mại điện tử chuyên kinh doanh board game lịch sử, sản phẩm sưu tầm và phụ kiện liên quan. Hệ thống hướng đến trải nghiệm mua sắm mang sắc thái bí ẩn, trinh thám và vintage, trong đó sản phẩm trọng tâm là **“ẨN: Mật Án Lệ Chi Viên”**.

Website hỗ trợ toàn bộ quy trình từ giới thiệu sản phẩm, tìm kiếm, đặt hàng và thanh toán giả lập đến quản lý đơn hàng, đổi/trả, đánh giá và quản trị tồn kho. Giao diện được tổ chức rõ ràng, có khả năng thích ứng với nhiều kích thước màn hình và thuận tiện cho việc trình bày đồ án.

## 2. Đối tượng người dùng

- **Khách truy cập (Guest):** người chưa đăng nhập, có nhu cầu tìm hiểu thương hiệu, xem sản phẩm, bài viết và chương trình ưu đãi.
- **Khách hàng (Customer):** người đã đăng ký tài khoản, có nhu cầu mua hàng và quản lý các hoạt động sau bán hàng.
- **Quản trị viên (Admin):** nhân sự vận hành cửa hàng, chịu trách nhiệm quản lý dữ liệu và xử lý nghiệp vụ.

## 3. Vai trò và phạm vi chức năng

### 3.1. Guest

- Xem trang chủ, trang giới thiệu và thông tin liên hệ.
- Xem, tìm kiếm, lọc và sắp xếp danh sách sản phẩm.
- Xem chi tiết sản phẩm, bài viết và chương trình ưu đãi.
- Đăng ký hoặc đăng nhập tài khoản khách hàng.

### 3.2. Customer

- Quản lý hồ sơ cá nhân và địa chỉ giao hàng.
- Thêm sản phẩm vào giỏ, cập nhật số lượng hoặc xóa sản phẩm.
- Áp dụng voucher, thực hiện checkout và thanh toán giả lập.
- Xem lịch sử, chi tiết và trạng thái đơn hàng.
- Hủy đơn khi đủ điều kiện; gửi yêu cầu đổi/trả đối với đơn đã giao.
- Đánh giá sản phẩm đã mua và theo dõi phản hồi liên quan.

### 3.3. Admin

- Đăng nhập tại khu vực quản trị riêng.
- Theo dõi số liệu tổng quan trên dashboard.
- Quản lý danh mục, sản phẩm, hình ảnh và trạng thái kinh doanh.
- Quản lý tồn kho và lịch sử biến động kho.
- Tiếp nhận, xác nhận và cập nhật trạng thái đơn hàng.
- Quản lý voucher, chương trình khuyến mãi, yêu cầu đổi/trả và đánh giá.
- Quản lý bài viết và tin nhắn liên hệ.

## 4. Các phân hệ chính

Hệ thống gồm các phân hệ: trang chủ; giới thiệu; sản phẩm; tài khoản và địa chỉ; giỏ hàng; voucher và khuyến mãi; checkout và thanh toán; đơn hàng; đổi/trả; đánh giá; blog; liên hệ; quản trị sản phẩm, đơn hàng và tồn kho.

Luồng nghiệp vụ cốt lõi là: xem sản phẩm → kiểm tra tồn kho → thêm vào giỏ → đăng nhập → chọn địa chỉ → áp dụng voucher → xác nhận chi phí → thanh toán giả lập → tạo đơn và trừ tồn kho khi thanh toán thành công → quản trị viên xử lý đơn.

## 5. Mục tiêu hệ thống

- Xây dựng website thương mại điện tử có quy trình nghiệp vụ đầy đủ, nhất quán và dễ kiểm chứng.
- Cung cấp trải nghiệm mua sắm trực quan, phù hợp với chủ đề board game lịch sử cao cấp.
- Bảo đảm dữ liệu khách hàng và tài khoản quản trị được tách biệt rõ ràng.
- Kiểm soát chính xác giỏ hàng, voucher, thanh toán và biến động tồn kho.
- Hỗ trợ quản trị cửa hàng tập trung, thuận tiện cho vận hành và trình diễn.
- Tạo nền tảng có cấu trúc module, dễ bảo trì, mở rộng và giải thích trong báo cáo.

## 6. Phạm vi và giới hạn

Phiên bản đồ án sử dụng thanh toán giả lập và chưa tích hợp cổng thanh toán hoặc dịch vụ email thực tế. Các chức năng được xây dựng nhằm minh họa đầy đủ luồng thương mại điện tử; kiến trúc cho phép thay thế các dịch vụ giả lập bằng dịch vụ thật trong giai đoạn phát triển tiếp theo.
