# Tóm tắt quy trình nghiệp vụ

## 1. Phạm vi mô hình

Các quy trình được mô tả theo ba nhóm tác nhân chính: **Guest/Customer**, **Hệ thống** và **Admin**. Mỗi luồng nêu rõ sự kiện bắt đầu, hoạt động xử lý, điểm quyết định và kết quả kết thúc để làm cơ sở xây dựng BPMN chi tiết.

## 2. Luồng mua hàng tổng thể

1. Người dùng truy cập website và xem danh sách hoặc chi tiết sản phẩm.
2. Hệ thống hiển thị thông tin, giá và lượng hàng khả dụng.
3. Người dùng chọn số lượng và yêu cầu thêm vào giỏ.
4. Hệ thống kiểm tra trạng thái sản phẩm và tồn kho, sau đó cập nhật giỏ nếu hợp lệ.
5. Người dùng chuyển sang checkout; nếu chưa đăng nhập thì thực hiện đăng nhập hoặc đăng ký.
6. Khách hàng chọn địa chỉ, nhập voucher và xác nhận thông tin đơn hàng.
7. Hệ thống tính tổng tiền, tạo mã đơn và thực hiện thanh toán giả lập.
8. Nếu thành công, hệ thống tạo dữ liệu đơn hàng, trừ kho, ghi giao dịch kho và xóa giỏ; nếu thất bại, hệ thống giữ giỏ hàng và cho phép thử lại.
9. Admin tiếp nhận, xác nhận và cập nhật trạng thái cho đến khi đơn được giao hoặc hủy.

## 3. Luồng đăng ký và đăng nhập

### Đăng ký

1. Guest nhập họ tên, email, số điện thoại và mật khẩu.
2. Hệ thống kiểm tra dữ liệu bắt buộc, định dạng và email trùng lặp.
3. Nếu không hợp lệ, hệ thống trả thông báo để người dùng sửa.
4. Nếu hợp lệ, hệ thống mã hóa mật khẩu, tạo tài khoản khách hàng và thông báo thành công.

### Đăng nhập

1. Người dùng nhập email và mật khẩu.
2. Hệ thống tìm tài khoản trong `users`, kiểm tra mật khẩu và trạng thái.
3. Nếu hợp lệ, hệ thống tạo phiên đăng nhập và điều hướng đến trang phù hợp.
4. Admin sử dụng luồng đăng nhập riêng với dữ liệu trong `admins`; hai loại tài khoản không dùng chung cơ chế phân vai trong `users`.

## 4. Luồng quản lý địa chỉ

1. Customer mở danh sách địa chỉ của tài khoản.
2. Customer chọn thêm, sửa, xóa hoặc đặt địa chỉ mặc định.
3. Hệ thống kiểm tra tên người nhận, số điện thoại, tỉnh/thành, phường/xã và địa chỉ chi tiết; quận/huyện được giữ tùy chọn cho địa chỉ cũ.
4. Nếu dữ liệu hợp lệ, hệ thống lưu thay đổi; khi chọn địa chỉ mặc định mới, địa chỉ mặc định cũ được bỏ đánh dấu.
5. Địa chỉ đang được tham chiếu bởi đơn hàng vẫn phải được bảo toàn dưới dạng dữ liệu giao nhận đã chốt trong đơn.

## 5. Luồng giỏ hàng

1. Người dùng chọn sản phẩm và số lượng.
2. Hệ thống kiểm tra sản phẩm đang bán và lượng hàng khả dụng.
3. Nếu không đủ hàng, hệ thống từ chối cập nhật và hiển thị thông báo giới hạn.
4. Nếu hợp lệ, hệ thống thêm dòng mới hoặc cộng số lượng vào dòng hiện có.
5. Customer có thể tăng, giảm hoặc xóa sản phẩm; hệ thống tính lại tạm tính sau mỗi thay đổi.
6. Không phát sinh nghiệp vụ trừ kho trong giai đoạn giỏ hàng.

## 6. Luồng áp dụng voucher

1. Customer nhập mã voucher tại giỏ hàng hoặc checkout.
2. Hệ thống kiểm tra trạng thái, thời gian hiệu lực, giá trị đơn tối thiểu và giới hạn lượt dùng.
3. Nếu không hợp lệ, hệ thống thông báo lý do và giữ nguyên tổng tiền.
4. Nếu hợp lệ, hệ thống tính `discount_amount`, áp dụng giới hạn giảm tối đa và cập nhật `final_amount`.
5. Trước khi thanh toán, voucher được kiểm tra lại để tránh sử dụng dữ liệu đã hết hiệu lực.
6. Lượt sử dụng chỉ được ghi nhận khi thanh toán thành công.

## 7. Luồng checkout và thanh toán

1. Hệ thống kiểm tra trạng thái đăng nhập và giỏ hàng.
2. Customer chọn địa chỉ giao hàng, voucher và phương thức thanh toán giả lập.
3. Hệ thống kiểm tra lại sản phẩm, giá, tồn kho và voucher.
4. Hệ thống tính `subtotal`, `discount_amount`, `shipping_fee`, `final_amount` và tạo `order_code` duy nhất.
5. Cổng thanh toán giả lập trả về **thành công** hoặc **thất bại**.
6. Nhánh thành công: tạo `orders`, `order_items`, `payments`; trừ tồn kho; tạo `inventory_transactions`; tăng lượt dùng voucher; xóa giỏ; hiển thị trang đặt hàng thành công.
7. Nhánh thất bại: không trừ kho, không xóa giỏ, thông báo thất bại và cho phép thanh toán lại.

Các cập nhật ở nhánh thành công cần được xử lý trong một giao dịch dữ liệu thống nhất. Nếu một bước lỗi, toàn bộ thay đổi liên quan phải được hoàn tác để tránh đơn hàng và tồn kho sai lệch.

## 8. Luồng Admin xử lý đơn

1. Admin đăng nhập và mở danh sách đơn hàng.
2. Hệ thống hiển thị đơn theo trạng thái và cho phép xem chi tiết.
3. Admin kiểm tra thông tin khách hàng, thanh toán, sản phẩm và tồn kho liên quan.
4. Admin xác nhận đơn, chuẩn bị hàng và lần lượt cập nhật trạng thái **Đã xác nhận** → **Đang giao** → **Đã giao**.
5. Nếu hủy đơn, hệ thống kiểm tra tác động tồn kho, hoàn kho khi cần và lưu lý do.
6. Customer theo dõi được trạng thái mới nhất trong khu vực tài khoản.

## 9. Luồng đổi/trả

1. Customer chọn một đơn đã giao và sản phẩm cần đổi/trả.
2. Customer nhập lý do, số lượng và hình ảnh minh chứng nếu có.
3. Hệ thống kiểm tra thời hạn, trạng thái đơn và yêu cầu trùng lặp.
4. Yêu cầu hợp lệ được tạo với trạng thái **Chờ duyệt**.
5. Admin xem xét, ghi chú và chọn **Đã duyệt** hoặc **Từ chối**.
6. Nếu hàng được nhận lại và đủ điều kiện nhập kho, hệ thống cộng tồn và ghi giao dịch hoàn hàng.
7. Customer theo dõi kết quả xử lý trong tài khoản.

## 10. Luồng quản lý tồn kho

1. Admin xem lượng tồn, lượng giữ chỗ, lượng khả dụng và danh sách sắp hết hàng.
2. Khi nhập kho hoặc điều chỉnh thủ công, Admin nhập số lượng và lý do.
3. Hệ thống kiểm tra dữ liệu, cập nhật `inventories` và ghi `inventory_transactions`.
4. Khi thanh toán thành công, hệ thống tự động ghi giao dịch bán hàng và giảm tồn.
5. Khi hủy đơn hoặc hoàn hàng đủ điều kiện, hệ thống ghi giao dịch bù và tăng tồn.
6. Mọi giao dịch lưu số lượng trước và sau thay đổi để hỗ trợ truy vết và đối soát.
