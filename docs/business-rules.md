# Quy tắc nghiệp vụ

## 1. Tài khoản khách hàng

1. Bảng `users` chỉ lưu tài khoản khách hàng; không sử dụng trường `role` để biểu diễn quản trị viên.
2. Email khách hàng phải duy nhất, đúng định dạng và không được để trống.
3. Mật khẩu phải được mã hóa trước khi lưu; không hiển thị lại mật khẩu dưới dạng văn bản thuần.
4. Chỉ tài khoản đang hoạt động mới được đăng nhập và thực hiện giao dịch.
5. Khách hàng chỉ được xem và cập nhật hồ sơ, địa chỉ, giỏ hàng và đơn hàng thuộc tài khoản của mình.
6. Khách chưa đăng nhập được xem sản phẩm nhưng phải đăng nhập trước khi checkout.
7. Email và số điện thoại đăng ký phải duy nhất giữa các tài khoản khách hàng; quy tắc duy nhất không áp dụng cho số điện thoại người nhận hàng.
8. Số điện thoại phải gồm 10 chữ số, bắt đầu bằng `03`, `05`, `07`, `08` hoặc `09`, đồng thời không được là chuỗi một chữ số lặp lại như `0000000000`.
9. Khách hàng được thay đổi email trong hồ sơ nếu email mới đúng định dạng và chưa thuộc tài khoản khác.

## 2. Tài khoản quản trị

1. Tài khoản quản trị được lưu riêng trong bảng `admins` và đăng nhập qua khu vực `/admin/login`.
2. Quản trị viên không sử dụng tài khoản khách hàng để truy cập chức năng quản trị.
3. Chỉ quản trị viên có trạng thái hoạt động mới được đăng nhập.
4. Các thao tác làm thay đổi sản phẩm, đơn hàng, voucher và tồn kho phải xác định được quản trị viên thực hiện khi cần kiểm tra lịch sử.

## 3. Sản phẩm

1. Mỗi sản phẩm thuộc một danh mục và có mã định danh duy nhất.
2. Giá bán phải lớn hơn hoặc bằng 0; giá khuyến mãi, nếu có, phải nhỏ hơn giá gốc.
3. Chỉ sản phẩm có trạng thái đang bán mới xuất hiện trên khu vực mua hàng.
4. Sản phẩm hết hàng vẫn có thể được hiển thị nhưng nút thêm vào giỏ phải bị vô hiệu hóa.
5. Hình ảnh sản phẩm sử dụng tài nguyên local trong `img/products` khi dữ liệu tương ứng tồn tại.
6. Việc ẩn sản phẩm không được làm mất dữ liệu trong các đơn hàng đã phát sinh.

## 4. Giỏ hàng

1. Mỗi khách hàng có tối đa một giỏ hàng đang hoạt động.
2. Một sản phẩm chỉ xuất hiện một dòng trong giỏ; nếu thêm lại thì tăng số lượng hiện có.
3. Số lượng phải là số nguyên dương và không vượt quá lượng hàng khả dụng.
4. Khi số lượng đạt giới hạn tồn kho, hệ thống hiển thị: **“Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này.”**
5. Thêm hoặc cập nhật giỏ hàng không làm giảm tồn kho thực tế.
6. Không cho phép checkout khi giỏ hàng rỗng hoặc chứa sản phẩm không còn hợp lệ.
7. Giá và tồn kho phải được kiểm tra lại tại thời điểm checkout.
8. Khách hàng có thể chọn một phần sản phẩm trong giỏ để thanh toán; sản phẩm không được chọn tiếp tục được giữ trong giỏ.

## 5. Tồn kho

1. Mỗi sản phẩm có một bản ghi tồn kho trong `inventories`.
2. Lượng hàng khả dụng được xác định từ số lượng tồn và số lượng đang được giữ chỗ theo thiết kế triển khai.
3. Tồn kho chỉ được trừ sau khi thanh toán thành công.
4. Thanh toán thất bại không làm thay đổi tồn kho và không xóa giỏ hàng.
5. Mọi biến động kho phải tạo bản ghi trong `inventory_transactions`, gồm loại giao dịch, lượng thay đổi, số lượng trước và sau, lý do và thời điểm.
6. Khi hủy đơn hoặc hoàn hàng đủ điều kiện nhập lại kho, hệ thống cộng lại đúng số lượng và ghi giao dịch tương ứng.
7. Sản phẩm có lượng khả dụng không vượt quá ngưỡng cảnh báo được đánh dấu sắp hết hàng cho quản trị viên.

## 6. Voucher

1. Mã voucher phải duy nhất và ở trạng thái hoạt động.
2. Voucher chỉ hợp lệ trong khoảng thời gian bắt đầu và kết thúc.
3. Giá trị đơn hàng phải đạt mức tối thiểu nếu voucher có quy định.
4. Số lượt đã dùng không được vượt quá giới hạn sử dụng tổng hoặc giới hạn theo khách hàng nếu có.
5. Mức giảm được tính theo loại voucher và không vượt quá giá trị giảm tối đa.
6. Mỗi đơn hàng chỉ áp dụng một voucher, trừ khi hệ thống được mở rộng với quy tắc cộng dồn rõ ràng.
7. Chỉ tăng số lượt sử dụng voucher sau khi thanh toán thành công.
8. Voucher miễn phí vận chuyển chỉ đưa `shipping_fee` về 0, không làm giảm `subtotal`.

## 7. Đặt hàng và thanh toán

1. Khách hàng phải đăng nhập, có địa chỉ giao hàng hợp lệ và giỏ hàng không rỗng.
2. Hệ thống kiểm tra lại trạng thái sản phẩm, giá và tồn kho trước khi tạo giao dịch thanh toán.
3. Tổng thanh toán được tính theo công thức: `final_amount = subtotal - discount_amount + shipping_fee`.
4. Mỗi đơn hàng có `order_code` duy nhất để tra cứu.
5. Khi thanh toán thành công, hệ thống tạo đơn, chi tiết đơn, bản ghi thanh toán, cập nhật voucher, trừ kho, ghi giao dịch kho và xóa giỏ hàng.
6. Khi thanh toán thất bại, hệ thống lưu trạng thái thất bại nếu cần, giữ nguyên giỏ hàng và cho phép thử lại.
7. Giá tại thời điểm mua phải được lưu trong `order_items` để không bị ảnh hưởng khi giá sản phẩm thay đổi sau này.
8. Đơn COD được tạo với trạng thái chưa thanh toán và chưa trừ tồn kho; khi giao thành công, hệ thống ghi nhận thanh toán, trừ kho và tăng lượt dùng voucher.

## 8. Hủy đơn

1. Đơn ở trạng thái **Chờ xác nhận** được hủy ngay sau khi khách hàng xác nhận lý do.
2. Đơn **Đã xác nhận** hoặc **Đang giao** chỉ được hủy sau khi quản trị viên duyệt yêu cầu.
3. Đơn **Đã giao** hoặc **Đã hủy** không tiếp nhận yêu cầu hủy mới.
4. Nếu đơn đã làm giảm tồn kho, thao tác hủy phải hoàn lại kho và tạo giao dịch kho.
5. Lý do hủy, trạng thái xét duyệt, người thực hiện và thời điểm hủy phải được lưu để đối soát.

## 9. Đổi/trả

1. Chỉ sản phẩm thuộc đơn đã giao mới được tạo yêu cầu đổi/trả.
2. Yêu cầu phải nằm trong thời hạn áp dụng và có lý do rõ ràng; hình ảnh minh chứng được bổ sung khi cần.
3. Một sản phẩm trong đơn không được có nhiều yêu cầu đang xử lý trùng nhau.
4. Trạng thái xử lý gồm **Chờ duyệt**, **Đã duyệt** và **Từ chối**.
5. Khi hàng được chấp nhận nhập lại kho, hệ thống cập nhật tồn và ghi `inventory_transactions`.

## 10. Đánh giá

1. Chỉ khách hàng đã mua sản phẩm trong đơn đã giao mới được đánh giá.
2. Điểm đánh giá là số nguyên từ 1 đến 5; nội dung nhận xét phải tuân thủ giới hạn độ dài.
3. Mỗi khách hàng chỉ được tạo một đánh giá cho một sản phẩm trong một đơn hàng, trừ khi có chính sách chỉnh sửa.
4. Quản trị viên có thể ẩn nội dung vi phạm nhưng không được thay đổi điểm hoặc nội dung gốc của khách hàng.
5. Đánh giá bị ẩn không xuất hiện công khai nhưng vẫn được lưu để phục vụ kiểm tra.
