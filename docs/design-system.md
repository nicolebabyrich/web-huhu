# Hệ thống thiết kế ẨN Store

## 1. Định hướng thị giác

Giao diện ẨN Store kết hợp năm đặc trưng: **lịch sử**, **bí ẩn**, **trinh thám**, **vintage** và **premium board game**. Không gian thị giác gợi cảm giác hồ sơ cổ, bản đồ, gỗ sẫm và kim loại đồng nhưng vẫn bảo đảm khả năng đọc và thao tác của một website thương mại điện tử hiện đại.

Nguyên tắc thiết kế:

- Nền tối dùng cho khu vực tạo điểm nhấn; nền giấy sáng dùng cho phần nội dung dài.
- Màu đồng/vàng cổ chỉ dùng có kiểm soát cho hành động chính và chi tiết trang trí.
- Nội dung quan trọng phải hiển thị trực tiếp, không phụ thuộc hoàn toàn vào hiệu ứng hover.
- Hình ảnh sản phẩm là trọng tâm; họa tiết chỉ đóng vai trò hỗ trợ.
- Ảnh nền kiến trúc cổ được đặt tại `img/backgrounds/` và chỉ dùng ở vùng hero với lớp phủ tối để bảo đảm độ tương phản.
- Khoảng trắng, đường viền mảnh và phân cấp chữ tạo cảm giác cao cấp, tránh trang trí dày đặc.

## 2. Bảng màu

| Token đề xuất | Mã màu | Mục đích sử dụng |
|---|---:|---|
| `--color-ink` | `#171512` | Chữ chính, nền tối |
| `--color-charcoal` | `#26221D` | Header, footer, panel nổi bật |
| `--color-ivory` | `#F4EFE3` | Nền trang sáng |
| `--color-paper` | `#E8DEC9` | Card phụ, vùng nội dung vintage |
| `--color-bronze` | `#A87535` | Nút chính, icon, đường nhấn |
| `--color-gold` | `#C7A45A` | Trạng thái cao cấp, hover có kiểm soát |
| `--color-wine` | `#6D2528` | Khuyến mãi, điểm nhấn bí ẩn |
| `--color-forest` | `#31463A` | Thành công, trạng thái đang bán |
| `--color-danger` | `#A33A32` | Lỗi, hủy, cảnh báo quan trọng |
| `--color-muted` | `#756E64` | Chữ phụ |
| `--color-border` | `#C9BDA8` | Viền và đường phân cách |
| `--color-white` | `#FFFFFF` | Chữ trên nền tối |

Độ tương phản giữa chữ và nền phải đủ rõ. Không dùng màu sắc làm dấu hiệu trạng thái duy nhất; luôn kết hợp nhãn hoặc biểu tượng.

## 3. Typography

- **Font thương hiệu và tiêu đề chính:** `SVN A Love Of Thunder`, dùng cho logo, banner và tiêu đề cấp cao.
- **Font nội dung:** `IBM Plex Sans`, dùng cho đoạn văn, mô tả sản phẩm, menu và biểu mẫu.
- **Font nhấn:** `SVN Nexa Rust`, dùng cho tiêu đề phụ, nhãn sản phẩm và chi tiết trang trí.
- **Font giao diện bổ trợ:** `SVN Cintra Regular` khi tài nguyên font khả dụng; fallback về `IBM Plex Sans` cho nút và thành phần đồ họa.
- **Độ đậm:** 400 cho nội dung, 500-600 cho nhãn và nút, 600-700 cho tiêu đề.
- **Chiều cao dòng:** 1.2-1.3 cho tiêu đề; 1.5-1.7 cho văn bản dài.

Thang chữ đề xuất:

| Cấp | Desktop | Mobile | Công dụng |
|---|---:|---:|---|
| Display | 56 px | 38 px | Tiêu đề hero |
| H1 | 44 px | 32 px | Tiêu đề trang |
| H2 | 34 px | 26 px | Tiêu đề section |
| H3 | 24 px | 21 px | Tiêu đề card/nhóm |
| Body large | 18 px | 17 px | Đoạn mở đầu |
| Body | 16 px | 16 px | Nội dung chính |
| Small | 14 px | 14 px | Chú thích, metadata |

## 4. Khoảng cách và hình khối

- Đơn vị cơ sở: `4 px`.
- Thang khoảng cách: `4, 8, 12, 16, 24, 32, 48, 64, 96 px`.
- Bo góc nhỏ `4 px` cho input và nhãn; bo góc vừa `8 px` cho card; hạn chế bo tròn lớn để giữ chất vintage.
- Shadow card: nhẹ, màu đen trong suốt; trạng thái hover tăng độ nổi vừa phải.
- Đường viền: `1 px solid var(--color-border)`; các đường trang trí có thể dùng màu bronze.

## 5. Button style

### Nút chính

- Nền `--color-bronze`, chữ sáng, độ đậm 600.
- Chiều cao tối thiểu 44 px; padding ngang 20-24 px.
- Hover chuyển sang `--color-gold`; focus có outline rõ ràng.
- Dùng cho “Thêm vào giỏ hàng”, “Tiến hành thanh toán” và hành động xác nhận.

### Nút phụ

- Nền trong suốt, viền bronze, chữ ink hoặc ivory tùy nền.
- Dùng cho “Xem chi tiết”, “Tiếp tục mua hàng” và hành động không phải ưu tiên cao nhất.

### Nút nguy hiểm

- Dùng `--color-danger`; luôn có nhãn hành động rõ ràng và bước xác nhận khi thao tác không thể hoàn tác.

### Trạng thái

- `disabled`: giảm độ tương phản, đổi con trỏ và không nhận tương tác.
- `loading`: giữ nguyên kích thước nút, hiển thị chỉ báo tiến trình và khóa thao tác lặp.
- `focus-visible`: outline tối thiểu 2 px, không loại bỏ dấu hiệu bàn phím.

## 6. Product card style

Product card gồm các vùng theo thứ tự ổn định:

1. Khung ảnh có tỷ lệ thống nhất, ưu tiên `4:5` hoặc tỷ lệ phù hợp với ảnh sản phẩm local.
2. Nhãn danh mục, trạng thái hoặc mức giảm giá.
3. Tên sản phẩm tối đa hai dòng.
4. Giá bán; giá gốc gạch ngang khi có giảm giá.
5. Thông tin ngắn như số người chơi hoặc thời lượng.
6. Nút xem chi tiết và thêm vào giỏ.

Card dùng nền ivory/paper, viền mảnh và shadow nhẹ. Ảnh sử dụng `object-fit: cover` hoặc `contain` theo loại tài nguyên, có `alt` mô tả. Khi hết hàng, card hiển thị nhãn “Hết hàng” và vô hiệu hóa nút mua.

## 7. Layout grid

- Container desktop tối đa `1200-1280 px`, căn giữa.
- Padding ngang: 64 px ở màn hình lớn, 32 px ở tablet, 16-20 px ở mobile.
- Grid desktop: 12 cột, gutter 24 px.
- Grid tablet: 8 cột, gutter 20 px.
- Grid mobile: 4 cột, gutter 16 px.
- Danh sách sản phẩm: 4 card/hàng ở desktop lớn, 3 ở desktop nhỏ, 2 ở tablet và 1-2 ở mobile tùy chiều rộng tối thiểu của card.
- Khoảng cách section tiêu chuẩn: 80-96 px ở desktop, 56-64 px ở tablet và 40-48 px ở mobile.

## 8. Responsive breakpoint

| Tên | Khoảng tham chiếu | Hành vi chính |
|---|---:|---|
| Mobile | `< 576 px` | Một cột nội dung, điều hướng thu gọn |
| Mobile lớn | `≥ 576 px` | Hai cột card khi đủ không gian |
| Tablet | `≥ 768 px` | Grid 8 cột, nội dung chia vùng |
| Desktop | `≥ 1024 px` | Điều hướng đầy đủ, grid 12 cột |
| Desktop lớn | `≥ 1280 px` | Container tối đa, tăng khoảng trắng |

Các kích thước cần kiểm tra trực tiếp: **390 px, 768 px, 1024 px và 1440 px**. Mọi trang phải tránh overflow ngang và duy trì vùng chạm tối thiểu khoảng 44 × 44 px.

## 9. Thành phần dùng chung

- `MainLayout`, `Navbar`, `Footer`.
- `Button`, `SectionTitle`, `ProductCard`, `CategoryCard`.
- `FormField`, `StatusBadge`, `PriceDisplay`.
- `EmptyState`, `LoadingState`, `ErrorState`.
- `Modal`, `Toast`, `Pagination` và `Breadcrumb` khi cần.

Các component dùng cùng token màu, font, spacing, radius và shadow; không đặt style lặp lại tùy ý theo từng trang.

## 10. Lưu ý khi import sang Figma

Để việc chuyển giao diện bằng website-to-Figma plugin đạt kết quả ổn định:

- Dùng semantic HTML và phân cấp `header`, `nav`, `main`, `section`, `article`, `footer` rõ ràng.
- Ưu tiên Flexbox/Grid; hạn chế định vị tuyệt đối cho bố cục chính.
- Dùng CSS variables cho token, class có ý nghĩa và style tập trung; hạn chế inline style.
- Đặt kích thước ảnh, tỷ lệ khung và fallback để tránh layout shift hoặc ảnh lỗi.
- Không để nội dung quan trọng chỉ xuất hiện khi hover, animation hoặc JavaScript chạy chậm.
- Mỗi section có nền, padding và container rõ ràng để layer sau khi import dễ nhận biết.
- Chụp/import từng viewport cố định: 1440 px, 1024 px, 768 px và 390 px.
- Tắt animation phức tạp trong lúc import và kiểm tra font đã tải hoàn tất.
- Sau khi import, đối chiếu lại Auto Layout, font, ảnh, khoảng cách và tên layer trước khi hoàn thiện file thiết kế.

