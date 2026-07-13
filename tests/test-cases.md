# Test cases - AN Store

Tài liệu này tổng hợp các trường hợp kiểm thử chính cho website thương mại điện tử AN Store. Trọng tâm kiểm thử là luồng mua hàng của khách, quản trị đơn hàng, tồn kho, đổi/trả, đánh giá, blog và các chức năng trình diễn nâng cao.

## Phạm vi kiểm thử

- Giao diện khách hàng: trang chủ, sản phẩm, chi tiết sản phẩm, tài khoản, địa chỉ, giỏ hàng, checkout, đơn hàng, đổi/trả, đánh giá, blog.
- Giao diện quản trị: dashboard, sản phẩm, danh mục, tồn kho, đơn hàng, voucher, đổi/trả, đánh giá, blog, liên hệ.
- Dữ liệu: schema, seed, tồn kho, hóa đơn, địa chỉ giao hàng, voucher, payment mock.
- Trải nghiệm nâng cao: mô hình 3D sản phẩm/nhân vật, video sản phẩm, QR thanh toán demo.
- Responsive: desktop, tablet, mobile.

## Nhóm A - Điều hướng và giao diện tổng thể

| Mã TC | Mục tiêu | Bước kiểm thử | Kết quả mong đợi | Mức ưu tiên |
|---|---|---|---|---|
| UI-01 | Kiểm tra navbar khách hàng | Mở trang chủ, sản phẩm, blog, đơn hàng, tài khoản | Menu hiển thị đúng, active menu đúng trang, không rớt chữ | Cao |
| UI-02 | Kiểm tra footer | Mở các trang chính và kéo xuống cuối trang | Logo, thông tin thương hiệu, chính sách và liên hệ hiển thị cân đối | Trung bình |
| UI-03 | Kiểm tra nút quay lại/đi tiếp | Bấm các nút điều hướng phụ trên các trang có tác vụ | Điều hướng đúng, không che nội dung, không lệch layout | Trung bình |
| UI-04 | Kiểm tra responsive | Test ở 1440px, 1024px, 768px, 390px | Nội dung không tràn, không đè chữ, card và form tự xuống dòng hợp lý | Cao |
| UI-05 | Kiểm tra font và line spacing | Quan sát toàn site user/admin | Font đúng bộ nhận diện, dòng chữ không quá sát, nút có khoảng cách hợp lý | Cao |

## Nhóm B - Sản phẩm và trải nghiệm 3D

| Mã TC | Mục tiêu | Bước kiểm thử | Kết quả mong đợi | Mức ưu tiên |
|---|---|---|---|---|
| PR-01 | Xem danh sách sản phẩm | Vào trang Sản phẩm | Hiển thị đầy đủ sản phẩm, giá, trạng thái, nút mua/giỏ hàng | Cao |
| PR-02 | Tìm kiếm sản phẩm | Nhập từ khóa hợp lệ và không hợp lệ | Danh sách lọc đúng; nếu không có kết quả thì hiển thị empty state | Cao |
| PR-03 | Lọc theo danh mục/khoảng giá | Chọn danh mục, nhập khoảng giá, áp dụng | Kết quả phù hợp bộ lọc, không mất layout | Cao |
| PR-04 | Sắp xếp sản phẩm | Chọn mới nhất, giá tăng dần, giá giảm dần | Sản phẩm đổi thứ tự đúng | Trung bình |
| PR-05 | Chi tiết sản phẩm | Mở một sản phẩm bất kỳ | Hiển thị ảnh, mô tả, thông số board game, tồn kho, sản phẩm liên quan | Cao |
| PR-06 | Sản phẩm hết hàng | Mở sản phẩm hết hàng | Nút mua/ngỏ hàng bị vô hiệu hóa, thông báo rõ ràng | Cao |
| PR-07 | Mô hình 3D sản phẩm | Mở sản phẩm có mô hình 3D | Mô hình hiển thị trực tiếp trên web, không bắt tải file | Cao |
| PR-08 | Video sản phẩm | Mở sản phẩm Ly Sứ ẨN | Video demo hiển thị và phát được trong trang chi tiết | Trung bình |
| PR-09 | Hồ sơ nhân vật 3D | Mở pop-up hồ sơ nhân vật và bấm xem mô hình 3D | Pop-up 3D mở đúng nhân vật, không lệch font/layout | Cao |

## Nhóm C - Tài khoản và địa chỉ

| Mã TC | Mục tiêu | Bước kiểm thử | Kết quả mong đợi | Mức ưu tiên |
|---|---|---|---|---|
| AC-01 | Đăng ký hợp lệ | Nhập họ tên, email, SĐT, ngày sinh, mật khẩu hợp lệ | Tạo tài khoản thành công | Cao |
| AC-02 | Validate email | Nhập email sai định dạng | Báo lỗi đỏ ngay tại trường, không chờ đến lúc submit | Cao |
| AC-03 | Validate SĐT | Nhập SĐT sai độ dài/đầu số/chuỗi giả | Báo lỗi đỏ ngay tại trường | Cao |
| AC-04 | Validate ngày sinh | Nhập ngày sinh chưa đủ 13 tuổi | Không cho đăng ký, hiển thị lý do rõ ràng | Cao |
| AC-05 | Đăng nhập/đăng xuất | Đăng nhập tài khoản khách và đăng xuất | Session cập nhật đúng, navbar thay đổi đúng | Cao |
| AC-06 | Quên mật khẩu demo | Nhập email nhận mật thư | Hiển thị luồng giả lập rõ ràng, không gây hiểu nhầm là email thật | Trung bình |
| AC-07 | Thêm/sửa/xóa địa chỉ | Thao tác quản lý địa chỉ | Địa chỉ lưu đúng, chọn mặc định đúng, validate đủ trường bắt buộc | Cao |
| AC-08 | Dữ liệu địa chỉ hành chính | Chọn tỉnh/thành, phường/xã | Danh sách địa chỉ load đúng từ file dữ liệu, không lỗi dropdown | Cao |

## Nhóm D - Giỏ hàng và checkout

| Mã TC | Mục tiêu | Bước kiểm thử | Kết quả mong đợi | Mức ưu tiên |
|---|---|---|---|---|
| CA-01 | Thêm vào giỏ hàng | Bấm thêm vào giỏ từ danh sách/chi tiết | Số lượng giỏ trên navbar tăng, có đường dẫn xem giỏ | Cao |
| CA-02 | Kiểm tra tồn kho khi thêm | Thêm vượt tồn kho | Không cho vượt, báo số lượng tối đa | Cao |
| CA-03 | Cập nhật giỏ hàng | Tăng, giảm, xóa sản phẩm | Số lượng và tạm tính cập nhật đúng | Cao |
| CA-04 | Empty cart | Xóa hết sản phẩm | Hiển thị trạng thái giỏ hàng rỗng và nút tiếp tục mua hàng | Trung bình |
| CO-01 | Checkout khi chưa đăng nhập | Từ giỏ hàng bấm checkout khi chưa login | Điều hướng đến đăng nhập | Cao |
| CO-02 | Checkout thiếu địa chỉ | Login tài khoản chưa có địa chỉ | Yêu cầu thêm địa chỉ giao hàng | Cao |
| CO-03 | Áp voucher hợp lệ | Nhập mã voucher còn hiệu lực | Giảm giá đúng theo điều kiện | Cao |
| CO-04 | Áp voucher không hợp lệ | Nhập mã hết hạn/sai điều kiện | Không áp dụng, hiển thị lý do | Cao |
| CO-05 | Thanh toán COD | Chọn COD và đặt hàng | Tạo đơn, thanh toán COD, trừ kho sau khi đặt thành công theo logic mock | Cao |
| CO-06 | Thanh toán QR demo | Chọn thanh toán online và xem QR | Pop-up QR hiển thị đúng ảnh, không tải file, không lỗi overlay | Cao |
| CO-07 | Hóa đơn | Hoàn tất checkout | Dữ liệu hóa đơn phản ánh subtotal, discount, shipping, total | Trung bình |

## Nhóm E - Đơn hàng, đổi/trả và đánh giá

| Mã TC | Mục tiêu | Bước kiểm thử | Kết quả mong đợi | Mức ưu tiên |
|---|---|---|---|---|
| OR-01 | Xem danh sách đơn | Vào trang Đơn hàng | Hiển thị đơn của khách, trạng thái và tổng tiền đúng | Cao |
| OR-02 | Xem chi tiết đơn | Mở một đơn hàng | Sản phẩm, địa chỉ, thanh toán, tổng tiền hiển thị cân đối | Cao |
| OR-03 | Hủy đơn hợp lệ | Hủy đơn Chờ xác nhận | Đơn chuyển trạng thái Đã hủy, tồn kho hoàn đúng nếu đã trừ | Cao |
| OR-04 | Mua lại | Bấm mua lại từ đơn cũ | Sản phẩm được thêm lại vào giỏ nếu còn hàng | Trung bình |
| RT-01 | Gửi yêu cầu đổi/trả | Chọn đơn đã giao, sản phẩm, lý do | Tạo yêu cầu chờ duyệt, nút ghi “Gửi yêu cầu đổi/ trả” | Cao |
| RT-02 | Upload minh chứng tùy chọn | Chọn file hoặc bỏ trống | Form vẫn hoạt động theo đúng yêu cầu | Trung bình |
| RV-01 | Gửi đánh giá | Chọn sản phẩm đã mua, sao, nhận xét | Đánh giá được lưu, validate từ ngữ cấm | Cao |
| RV-02 | Hiển thị review | Mở chi tiết sản phẩm có review | Review hợp lệ hiển thị, review bị ẩn không hiển thị | Trung bình |

## Nhóm F - Blog

| Mã TC | Mục tiêu | Bước kiểm thử | Kết quả mong đợi | Mức ưu tiên |
|---|---|---|---|---|
| BL-01 | Xem blog | Vào trang Blog từ navbar | Danh sách bài viết hiển thị đúng, layout không rớt chữ | Trung bình |
| BL-02 | Gửi blog user | Nhập tiêu đề, tóm tắt, nội dung, ảnh tùy chọn | Bài viết ở trạng thái chờ duyệt | Cao |
| BL-03 | Validate blog | Nhập nội dung quá ngắn hoặc chứa từ cấm | Báo lỗi rõ, không gửi bài | Cao |
| BL-04 | Pop-up nhập blog | Mở ô nhập blog dạng pop-up | Khung nhập rộng, dễ viết, có nút đóng/lưu rõ ràng | Trung bình |
| BL-05 | Admin duyệt blog user | Admin duyệt hoặc từ chối bài user gửi | Trạng thái cập nhật đúng | Cao |

## Nhóm G - Admin

| Mã TC | Mục tiêu | Bước kiểm thử | Kết quả mong đợi | Mức ưu tiên |
|---|---|---|---|---|
| AD-01 | Admin login | Đăng nhập bằng tài khoản admin | Vào dashboard admin, không dùng bảng users | Cao |
| AD-02 | Dashboard thống kê | Mở dashboard | KPI, biểu đồ doanh thu, trạng thái đơn, tồn kho, review hiển thị có ý nghĩa | Cao |
| AD-03 | Quản lý sản phẩm | Thêm/sửa/ẩn hiện sản phẩm | Dữ liệu cập nhật đúng, form không lệch hàng | Cao |
| AD-04 | Quản lý danh mục | Thêm/sửa/ẩn danh mục | Danh mục cập nhật đúng trên trang sản phẩm | Trung bình |
| AD-05 | Quản lý tồn kho | Cập nhật tồn kho | Tồn kho và inventory transaction cập nhật đúng | Cao |
| AD-06 | Quản lý đơn hàng | Xác nhận/cập nhật/hủy đơn | Trạng thái cập nhật đúng, cột cập nhật không lệch | Cao |
| AD-07 | Quản lý voucher | Tạo/sửa/tắt voucher | Điều kiện hạn dùng/lượt dùng hoạt động đúng | Cao |
| AD-08 | Duyệt đổi/trả | Duyệt hoặc từ chối yêu cầu | Nếu từ chối bắt buộc nhập lý do; nếu nhập kho thì cộng tồn kho | Cao |
| AD-09 | Quản lý đánh giá | Ẩn/hiện review | Giao diện user phản ánh đúng trạng thái | Trung bình |
| AD-10 | Quản lý liên hệ | Xử lý tin nhắn liên hệ | Có cột thao tác xử lý, trạng thái cập nhật đúng | Trung bình |
| AD-11 | Đăng xuất admin | Bấm đăng xuất | Quay về trang đăng nhập admin, nút không lỗi ký tự | Cao |

## Nhóm H - Database và dữ liệu mẫu

| Mã TC | Mục tiêu | Bước kiểm thử | Kết quả mong đợi | Mức ưu tiên |
|---|---|---|---|---|
| DB-01 | Kiểm tra schema | Đọc `database/schema.sql` | Có đủ bảng, khóa chính, khóa ngoại, trạng thái, timestamp | Cao |
| DB-02 | Tách users/admins | Kiểm tra bảng users và admins | users chỉ là khách hàng, admins là quản trị, không dùng users.role | Cao |
| DB-03 | Tồn kho | Kiểm tra inventories và inventory_transactions | Có thể truy vết nhập kho, bán hàng, hủy đơn, hoàn hàng | Cao |
| DB-04 | Seed data | Chạy/đọc seed | Có admin, khách hàng, danh mục, sản phẩm, voucher, đơn hàng, tồn kho mẫu | Cao |
| DB-05 | Invoice | Kiểm tra bảng invoice | Hóa đơn liên kết 1-1 với order, có subtotal/discount/shipping/total/status | Trung bình |

## Tiêu chí đạt

- Không có lỗi JavaScript syntax ở các module chính.
- Các luồng mua hàng, checkout, đơn hàng và admin xử lý đơn chạy được từ đầu đến cuối.
- Form validate trực tiếp tại trường nhập liệu, không đợi submit mới báo lỗi chính.
- Giao diện không rớt chữ nghiêm trọng ở desktop/tablet/mobile.
- Asset 3D, video, QR, logo, font và ảnh sản phẩm nằm đúng thư mục tối ưu trong `img/` hoặc `asset/`.
