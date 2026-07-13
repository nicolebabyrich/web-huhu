# Từ điển dữ liệu AN Store

## 1. Quy ước chung

- Tên bảng và tên cột dùng tiếng Anh, định dạng `snake_case`.
- Nội dung chú thích và mô tả nghiệp vụ dùng tiếng Việt.
- `users` chỉ lưu tài khoản khách hàng; `admins` lưu riêng tài khoản quản trị shop online.
- Các bảng nghiệp vụ có khóa chính, khóa ngoại, trạng thái và mốc thời gian khi phù hợp.
- Tồn kho chỉ được trừ sau khi đơn hàng/thanh toán hoàn tất theo luồng nghiệp vụ.

## 2. Mô tả bảng dữ liệu

### 2.1. `users`

Lưu thông tin khách hàng: họ tên, email, số điện thoại, mật khẩu đã băm, ngày sinh và trạng thái tài khoản. Bảng này không có `role` và không chứa tài khoản admin.

Quan hệ chính: `users` 1-n `addresses`, `carts`, `orders`, `reviews`, `blog_posts` khi khách gửi bài.

### 2.2. `admins`

Lưu tài khoản quản trị shop online: họ tên, email, mật khẩu đã băm, vai trò quản trị và trạng thái. Admin đăng nhập qua luồng riêng và không trộn với bảng `users`.

Quan hệ chính: `admins` có thể tạo bài blog, duyệt bài blog, xử lý liên hệ và ghi nhận giao dịch kho.

### 2.3. `addresses`

Lưu địa chỉ giao hàng của khách hàng, gồm người nhận, số điện thoại, tỉnh/thành, quận/huyện tùy chọn, phường/xã, địa chỉ chi tiết, nhãn địa chỉ và cờ mặc định.

### 2.4. `categories`

Lưu danh mục sản phẩm như BoardGame, Combo, Merchandise và Phụ kiện. Mỗi danh mục có slug, mô tả, thứ tự hiển thị và trạng thái.

### 2.5. `products`

Lưu thông tin sản phẩm: tên, slug, SKU, giá, giá giảm, tồn kho hiển thị, mô tả, bối cảnh lịch sử, thể loại game, số người chơi, độ tuổi, thời lượng, độ khó, thành phần hộp, tóm tắt cốt truyện và trạng thái.

### 2.6. `product_images`

Lưu nhiều ảnh cho một sản phẩm, gồm đường dẫn ảnh local, alt text, cờ ảnh chính và thứ tự hiển thị.

### 2.7. `carts`

Lưu giỏ hàng của khách hàng. Mỗi giỏ có trạng thái như đang hoạt động, đã checkout hoặc bị bỏ quên.

### 2.8. `cart_items`

Lưu sản phẩm trong giỏ hàng, số lượng và giá tham chiếu. Việc thêm vào giỏ không làm trừ tồn kho.

### 2.9. `promotions`

Lưu chương trình khuyến mãi, banner, thời gian hiệu lực và trạng thái hiển thị.

### 2.10. `vouchers`

Lưu mã giảm giá, loại giảm, giá trị giảm, mức giảm tối đa, điều kiện đơn tối thiểu, giới hạn lượt dùng, số lượt đã dùng và thời gian hiệu lực.

### 2.11. `orders`

Lưu đơn hàng, mã đơn, khách hàng, voucher nếu có, thông tin giao nhận đã chốt, tạm tính, giảm giá, phí vận chuyển, tổng thanh toán, ghi chú, trạng thái và lý do hủy nếu có.

### 2.12. `order_items`

Lưu chi tiết sản phẩm trong đơn hàng tại thời điểm mua: tên sản phẩm, SKU, ảnh, đơn giá, số lượng và thành tiền.

### 2.13. `payments`

Lưu giao dịch thanh toán của đơn hàng, gồm phương thức, nhà cung cấp, mã giao dịch, số tiền, trạng thái, thời điểm thanh toán và lý do thất bại nếu có.

### 2.14. `invoices`

Lưu hóa đơn bán hàng phát sinh từ đơn hàng và thanh toán tương ứng. Bảng có `invoice_code` để hiển thị, `order_id` và `payment_id` đều là khóa ngoại duy nhất, giúp bảo đảm mỗi hóa đơn gắn với một đơn hàng và một giao dịch thanh toán.

Các trạng thái hóa đơn gồm `ISSUED`, `CANCELLED`, `REFUNDED`.

### 2.15. `return_requests`

Lưu yêu cầu đổi/trả sau bán hàng, gồm mã yêu cầu, đơn hàng, sản phẩm trong đơn, khách hàng, loại yêu cầu, lý do, ảnh minh chứng, trạng thái, ghi chú admin và lý do từ chối nếu có.

### 2.16. `reviews`

Lưu đánh giá sản phẩm từ khách đã mua hàng, gồm sản phẩm, khách hàng, dòng đơn hàng, số sao, nhận xét, ảnh review và trạng thái hiển thị.

### 2.17. `blog_posts`

Lưu bài blog do admin hoặc user tạo. Bảng phân tách rõ:

- `author_user_id`: người dùng viết bài nếu bài do khách gửi.
- `author_admin_id`: admin viết bài nếu bài do shop tạo.
- `approved_by_admin_id`: admin duyệt bài.
- `admin_note`: ghi chú duyệt bài hoặc lý do xử lý.
- `approved_at`: thời điểm duyệt.
- `published_at`: thời điểm đăng.

Trạng thái gồm `DRAFT`, `PENDING`, `PUBLISHED`, `REJECTED`, `HIDDEN`.


### 2.18. `inventories`

Lưu tồn kho hiện tại của từng sản phẩm: số lượng tồn, số lượng giữ chỗ, số lượng khả dụng, ngưỡng cảnh báo và trạng thái kho. Quan hệ với `products` là 1-1.

### 2.19. `inventory_transactions`

Lưu lịch sử biến động kho, gồm loại giao dịch, số lượng thay đổi, số lượng trước/sau, lý do, đơn hàng hoặc yêu cầu đổi/trả liên quan và admin thực hiện nếu có.

## 3. Quan hệ dữ liệu chính

- `users` 1-n `addresses`.
- `users` 1-n `carts`.
- `carts` 1-n `cart_items`.
- `categories` 1-n `products`.
- `products` 1-n `product_images`.
- `users` 1-n `orders`.
- `orders` 1-n `order_items`.
- `orders` 1-1 `payments`.
- `orders` 1-1 `invoices`.
- `payments` 1-1 `invoices`.
- `orders` 1-n `return_requests`.
- `products` 1-n `reviews`.
- `users` 1-n `reviews`.
- `products` 1-1 `inventories`.
- `products` 1-n `inventory_transactions`.
- `admins` 1-n `blog_posts` thông qua `author_admin_id`.
- `users` 1-n `blog_posts` thông qua `author_user_id`.
- `admins` 1-n `blog_posts` thông qua `approved_by_admin_id`.

## 4. Nguyên tắc toàn vẹn

- Không dùng `users.role`; phân quyền quản trị nằm ở bảng `admins`.
- Không giảm tồn kho khi thêm sản phẩm vào giỏ hàng.
- Khi thanh toán/đặt hàng thành công, hệ thống tạo đơn, tạo payment, tạo invoice, trừ tồn kho và ghi `inventory_transactions`.
- Khi hủy đơn hoặc hoàn hàng đủ điều kiện, hệ thống cộng lại tồn kho và ghi lịch sử kho.
- Bài blog do user gửi phải qua trạng thái `PENDING` trước khi admin duyệt.
- Hóa đơn phải liên kết duy nhất với cả đơn hàng và giao dịch thanh toán.

