-- ============================================================
-- AN STORE - DỮ LIỆU MẪU
-- Chạy sau database/schema.sql trên cơ sở dữ liệu rỗng.
-- Dữ liệu dùng tiếng Việt, phù hợp concept board game lịch sử, bí ẩn, trinh thám.
-- ============================================================

SET NAMES utf8mb4;

-- 1. Tài khoản quản trị shop online
INSERT INTO admins (admin_id, full_name, email, password, role, status) VALUES
(1, 'Nguyễn An', 'admin@anstore.vn', '$2b$10$demoHashForPassword', 'SUPER_ADMIN', 'ACTIVE');

-- 2. Năm tài khoản khách hàng
INSERT INTO users (user_id, full_name, email, phone, password, date_of_birth, status) VALUES
(1, 'Nguyễn Thị Kim Kiều Oanh', 'oanhntkk24411@st.uel.edu.vn', '0704477397', '$2b$10$demoHashFor0704477397', '1998-03-12', 'ACTIVE'),
(2, 'Lê Ngọc Mai', 'mai.le@example.com', '0901000002', '$2b$10$demoHashForPassword', '2000-07-24', 'ACTIVE'),
(3, 'Phạm Gia Huy', 'huy.pham@example.com', '0901000003', '$2b$10$demoHashForPassword', '1997-11-05', 'ACTIVE'),
(4, 'Võ Thanh Hà', 'ha.vo@example.com', '0901000004', '$2b$10$demoHashForPassword', '2001-01-18', 'ACTIVE'),
(5, 'Đặng Quốc Bảo', 'bao.dang@example.com', '0901000005', '$2b$10$demoHashForPassword', '1999-09-09', 'ACTIVE');

-- 3. Địa chỉ giao hàng
INSERT INTO addresses (address_id, user_id, receiver_name, receiver_phone, province, district, ward, detail_address, address_label, is_default, status) VALUES
(1, 1, 'Nguyễn Thị Kim Kiều Oanh', '0704477397', 'Thành phố Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', '18 đường Trần Quốc Thảo', 'Nhà riêng', TRUE, 'ACTIVE'),
(2, 2, 'Lê Ngọc Mai', '0901000002', 'Hà Nội', 'Quận Hoàn Kiếm', 'Phường Hàng Bạc', '25 phố Hàng Bạc', 'Nhà riêng', TRUE, 'ACTIVE'),
(3, 3, 'Phạm Gia Huy', '0901000003', 'Đà Nẵng', 'Quận Hải Châu', 'Phường Thạch Thang', '42 đường Quang Trung', 'Công ty', TRUE, 'ACTIVE'),
(4, 4, 'Võ Thanh Hà', '0901000004', 'Thừa Thiên Huế', 'Thành phố Huế', 'Phường Thuận Thành', '11 đường Đinh Tiên Hoàng', 'Nhà riêng', TRUE, 'ACTIVE'),
(5, 5, 'Đặng Quốc Bảo', '0901000005', 'Quảng Nam', 'Thành phố Hội An', 'Phường Minh An', '7 đường Nguyễn Thái Học', 'Nhà riêng', TRUE, 'ACTIVE'),
(6, 1, 'Nguyễn Thị Kim Kiều Oanh', '0704477397', 'Thành phố Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', '88 đường Nguyễn Huệ', 'Công ty', FALSE, 'ACTIVE');

-- 4. Bốn danh mục sản phẩm
INSERT INTO categories (category_id, category_name, slug, description, display_order, status) VALUES
(1, 'BoardGame', 'boardgame', 'Board game lịch sử, suy luận và nhập vai.', 1, 'ACTIVE'),
(2, 'Combo', 'combo', 'Bộ sản phẩm kết hợp dành cho nhóm điều tra.', 2, 'ACTIVE'),
(3, 'Merchandise', 'merchandise', 'Vật phẩm sưu tầm mang dấu ấn thế giới ẨN.', 3, 'ACTIVE'),
(4, 'Phụ kiện', 'phu-kien', 'Phụ kiện hỗ trợ và bảo quản board game.', 4, 'ACTIVE');

-- 5. Mười hai sản phẩm mẫu
INSERT INTO products (
    product_id, category_id, product_name, slug, sku, price, discount_price,
    description, historical_period, game_type, player_count, age_rating, duration,
    difficulty_level, components, story_summary, status
) VALUES
(1, 1, 'ẨN: Mật Án Lệ Chi Viên', 'an-mat-an-le-chi-vien', 'AN-BG-001', 359000, 329000,
 'Board game trinh thám lịch sử đưa người chơi vào cuộc điều tra quanh biến cố Lệ Chi Viên.',
 'Đại Việt thế kỷ XV', 'Suy luận, nhập vai, giải mã', '3-6 người', 13, '90-120 phút', 'HARD',
 'Bản đồ Lệ Chi Viên, hồ sơ nhân vật, thẻ chứng cứ, mật thư, token và sách luật',
 'Người chơi lần theo lời khai và chứng cứ để tái dựng đêm định mệnh tại Lệ Chi Viên.', 'ACTIVE'),
(2, 2, 'Combo Sơ Khởi', 'combo-so-khoi', 'AN-CB-001', 429000, 389000,
 'Bộ khởi đầu gồm board game chính và phụ kiện cơ bản cho nhóm mới.',
 'Đại Việt thế kỷ XV', 'Combo điều tra', '3-6 người', 13, '90-120 phút', 'MEDIUM',
 'Board game chính, bookmark, sticker và sổ ghi chép',
 'Bộ hồ sơ đầu tiên dành cho nhóm điều tra muốn nhập vai nhanh.', 'ACTIVE'),
(3, 2, 'Combo Thiên Tử', 'combo-thien-tu', 'AN-CB-002', 790000, 699000,
 'Combo trọn vẹn cho từng cấp bậc điều tra viên với nhiều vật phẩm sưu tầm.',
 'Đại Việt trung đại', 'Combo suy luận', '3-6 người', 13, '120-150 phút', 'HARD',
 'Board game, poster, totebag, sticker, xúc xắc và huy hiệu',
 'Một bộ hồ sơ mở rộng giúp bàn chơi có đủ không khí điều tra cổ phong.', 'ACTIVE'),
(4, 2, 'Combo Hoàng Kim', 'combo-hoang-kim', 'AN-CB-003', 1299000, 1099000,
 'Phiên bản sưu tầm đầy đủ nhất dành cho người yêu lịch sử và board game.',
 'Đại Việt thế kỷ XV', 'Combo sưu tầm cao cấp', '3-6 người', 13, '120-180 phút', 'EXPERT',
 'Board game, artbook, standee, poster, totebag, ly sứ, sticker và bộ token',
 'Bản cao cấp tái hiện đầy đủ không khí mật án qua vật phẩm và hồ sơ.', 'ACTIVE'),
(5, 3, 'Áo Thun Oversize ẨN', 'ao-thun-oversize-an', 'AN-MD-001', 329000, 299000,
 'Áo thun oversize mang họa tiết nhân vật và dấu ấn thương hiệu ẨN.',
 'Cảm hứng Lệ Chi Viên', 'Merchandise', 'Không áp dụng', 12, 'Không áp dụng', 'EASY',
 'Một áo thun cotton oversize', 'Trang phục dành cho điều tra viên yêu dấu ấn cổ phong.', 'ACTIVE'),
(6, 3, 'Túi Tote Vải Canvas ẨN', 'tui-tote-vai-canvas-an', 'AN-MD-002', 229000, 199000,
 'Túi tote canvas in minh họa nhân vật từ thế giới ẨN.',
 'Cảm hứng Đại Việt', 'Merchandise', 'Không áp dụng', 12, 'Không áp dụng', 'EASY',
 'Một túi tote canvas dày', 'Vật phẩm đồng hành cùng người chơi sau mỗi ván án.', 'ACTIVE'),
(7, 3, 'Ly Sứ ẨN', 'ly-su-an', 'AN-MD-003', 189000, 169000,
 'Ly sứ in họa tiết nhân vật, phù hợp dùng trong góc chơi board game.',
 'Cảm hứng Lệ Chi Viên', 'Merchandise', 'Không áp dụng', 12, 'Không áp dụng', 'EASY',
 'Một ly sứ in màu, hộp giấy bảo vệ', 'Chiếc ly dành cho những buổi thảo luận giả thuyết kéo dài.', 'ACTIVE'),
(8, 3, 'Bookmark Nhân Vật', 'bookmark-nhan-vat', 'AN-MD-004', 79000, NULL,
 'Bộ bookmark minh họa các nhân vật trong mật án.',
 'Đại Việt thế kỷ XV', 'Merchandise', 'Không áp dụng', 10, 'Không áp dụng', 'EASY',
 'Năm bookmark giấy mỹ thuật', 'Mỗi bookmark là một manh mối nhỏ trong hồ sơ nhân vật.', 'ACTIVE'),
(9, 4, 'Bọc Thẻ Chống Xước', 'boc-the-chong-xuoc', 'AN-PK-001', 99000, NULL,
 'Bọc thẻ trong suốt giúp bảo quản bài và hồ sơ chứng cứ.',
 'Không áp dụng', 'Phụ kiện bảo quản', 'Không áp dụng', 10, 'Không áp dụng', 'EASY',
 'Một bộ 100 bọc thẻ', 'Giữ các thẻ chứng cứ bền đẹp qua nhiều ván chơi.', 'ACTIVE'),
(10, 4, 'Bộ Xúc Xắc Đồng Cổ', 'bo-xuc-xac-dong-co', 'AN-PK-002', 129000, NULL,
 'Bộ sáu xúc xắc màu đồng cổ dùng cho board game và nhập vai.',
 'Cảm hứng cổ điển', 'Phụ kiện chơi game', 'Không áp dụng', 10, 'Không áp dụng', 'EASY',
 'Sáu xúc xắc D6 và túi vải rút', 'Những viên xúc xắc tăng không khí cho bàn điều tra.', 'ACTIVE'),
(11, 4, 'Sổ Tay Điều Tra', 'so-tay-dieu-tra', 'AN-PK-003', 159000, 139000,
 'Sổ tay bìa giả da để ghi lời khai, giả thuyết và dấu vết.',
 'Cảm hứng hồ sơ cổ', 'Phụ kiện ghi chép', 'Không áp dụng', 12, 'Không áp dụng', 'EASY',
 'Một sổ tay 160 trang và dây đánh dấu', 'Cuốn sổ dành cho các điều tra viên ghi lại suy luận.', 'ACTIVE'),
(12, 1, 'Mật Thư Thành Cổ', 'mat-thu-thanh-co', 'AN-BG-002', 459000, NULL,
 'Board game giải mã những bức thư chưa kịp gửi từ một thành cổ.',
 'Việt Nam thế kỷ XX', 'Giải mã, kể chuyện', '1-4 người', 16, '45-75 phút', 'HARD',
 'Thư tay, bản đồ thành cổ, bảng mã, thẻ ký ức và sách truyện',
 'Những trang thư rời rạc dẫn người chơi tới câu chuyện còn bỏ ngỏ.', 'OUT_OF_STOCK');

-- 6. Hình ảnh sản phẩm local
INSERT INTO product_images (image_id, product_id, image_url, alt_text, is_primary, display_order) VALUES
(1, 1, 'img/products/23.png', 'Ảnh chính ẨN: Mật Án Lệ Chi Viên', TRUE, 1),
(2, 2, 'img/products/20.png', 'Ảnh chính Combo Sơ Khởi', TRUE, 1),
(3, 3, 'img/products/21.png', 'Ảnh chính Combo Thiên Tử', TRUE, 1),
(4, 4, 'img/products/22.png', 'Ảnh chính Combo Hoàng Kim', TRUE, 1),
(5, 5, 'img/products/5.png', 'Ảnh chính Áo Thun Oversize ẨN', TRUE, 1),
(6, 6, 'img/products/4.png', 'Ảnh chính Túi Tote Vải Canvas ẨN', TRUE, 1),
(7, 7, 'img/products/6.png', 'Ảnh chính Ly Sứ ẨN', TRUE, 1),
(8, 8, 'img/products/7.png', 'Ảnh chính Bookmark Nhân Vật', TRUE, 1),
(9, 9, 'img/products/8.png', 'Ảnh chính Bọc Thẻ Chống Xước', TRUE, 1),
(10, 10, 'img/products/10.png', 'Ảnh chính Bộ Xúc Xắc Đồng Cổ', TRUE, 1),
(11, 11, 'img/products/11.png', 'Ảnh chính Sổ Tay Điều Tra', TRUE, 1),
(12, 12, 'img/products/12.png', 'Ảnh chính Mật Thư Thành Cổ', TRUE, 1),
(13, 1, 'img/products/14.png', 'Chi tiết thẻ chứng cứ Lệ Chi Viên', FALSE, 2),
(14, 1, 'img/products/15.png', 'Chi tiết bản đồ điều tra Lệ Chi Viên', FALSE, 3),
(15, 4, 'img/products/18.png', 'Chi tiết Combo Hoàng Kim', FALSE, 2);

-- 7. Giỏ hàng mẫu
INSERT INTO carts (cart_id, user_id, status) VALUES
(1, 1, 'ACTIVE'),
(2, 2, 'ACTIVE');

INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1, 329000),
(2, 1, 7, 1, 169000),
(3, 2, 3, 1, 699000);

-- 8. Chương trình khuyến mãi và voucher
INSERT INTO promotions (promotion_id, promotion_name, description, banner_image, start_date, end_date, status) VALUES
(1, 'Mùa Hè Phá Án', 'Ưu đãi dành cho các nhóm điều tra trong mùa hè 2026.', 'img/products/13.png', '2026-06-01 00:00:00', '2026-08-31 23:59:59', 'ACTIVE'),
(2, 'Dấu Ấn Đại Việt', 'Khuyến mãi cho board game và vật phẩm mang cảm hứng lịch sử Việt Nam.', 'img/products/16.png', '2026-06-01 00:00:00', '2026-09-30 23:59:59', 'ACTIVE');

INSERT INTO vouchers (voucher_id, promotion_id, voucher_code, voucher_name, description, discount_type, discount_value, max_discount_amount, min_order_amount, usage_limit, used_count, start_date, end_date, status) VALUES
(1, 1, 'AN10', 'Giảm 10% đơn điều tra', 'Giảm 10% cho đơn từ 500.000 đồng, tối đa 150.000 đồng.', 'PERCENT', 10, 150000, 500000, 100, 12, '2026-06-01 00:00:00', '2026-08-31 23:59:59', 'ACTIVE'),
(2, 1, 'LECHI150', 'Ưu đãi Lệ Chi Viên', 'Giảm 150.000 đồng cho đơn từ 1.000.000 đồng.', 'FIXED', 150000, NULL, 1000000, 50, 8, '2026-06-01 00:00:00', '2026-08-31 23:59:59', 'ACTIVE'),
(3, 2, 'TANBINH50', 'Chào mừng tân điều tra viên', 'Giảm 50.000 đồng cho đơn đầu tiên từ 300.000 đồng.', 'FIXED', 50000, NULL, 300000, 200, 31, '2026-06-01 00:00:00', '2026-12-31 23:59:59', 'ACTIVE'),
(4, NULL, 'BIMAT15', 'Mật mã 15%', 'Voucher sự kiện đã kết thúc, dùng để kiểm thử ngày hết hạn.', 'PERCENT', 15, 120000, 400000, 30, 30, '2026-01-01 00:00:00', '2026-03-31 23:59:59', 'EXPIRED'),
(5, 2, 'VINTAGE100', 'Dấu ấn vintage', 'Giảm 100.000 đồng cho đơn từ 800.000 đồng.', 'FIXED', 100000, NULL, 800000, 80, 9, '2026-06-01 00:00:00', '2026-09-30 23:59:59', 'ACTIVE');

-- 9. Năm đơn hàng mẫu với đủ trạng thái
INSERT INTO orders (
    order_id, order_code, user_id, voucher_id, voucher_code, receiver_name, receiver_phone,
    province, district, ward, detail_address, subtotal, discount_amount, shipping_fee, final_amount,
    note, status, cancel_reason, created_at
) VALUES
(1, 'AN202607120001', 1, 1, 'AN10', 'Nguyễn Thị Kim Kiều Oanh', '0704477397', 'Thành phố Hồ Chí Minh', 'Quận 3', 'Phường Võ Thị Sáu', '18 đường Trần Quốc Thảo', 1227000, 90000, 0, 1137000, 'Giao hàng trong giờ hành chính.', 'PENDING', NULL, '2026-07-12 08:30:00'),
(2, 'AN202607100002', 2, NULL, NULL, 'Lê Ngọc Mai', '0901000002', 'Hà Nội', 'Quận Hoàn Kiếm', 'Phường Hàng Bạc', '25 phố Hàng Bạc', 359000, 0, 0, 359000, 'Gọi trước khi giao.', 'CONFIRMED', NULL, '2026-07-10 10:16:00'),
(3, 'AN202607090003', 3, 3, 'TANBINH50', 'Phạm Gia Huy', '0901000003', 'Đà Nẵng', 'Quận Hải Châu', 'Phường Thạch Thang', '42 đường Quang Trung', 748000, 50000, 30000, 728000, NULL, 'SHIPPING', NULL, '2026-07-09 14:22:00'),
(4, 'AN202606280004', 4, 2, 'LECHI150', 'Võ Thanh Hà', '0901000004', 'Thừa Thiên Huế', 'Thành phố Huế', 'Phường Thuận Thành', '11 đường Đinh Tiên Hoàng', 1250000, 150000, 0, 1100000, 'Đóng gói chống va đập.', 'DELIVERED', NULL, '2026-06-28 16:22:00'),
(5, 'AN202606180005', 5, NULL, NULL, 'Đặng Quốc Bảo', '0901000005', 'Quảng Nam', 'Thành phố Hội An', 'Phường Minh An', '7 đường Nguyễn Thái Học', 498000, 0, 30000, 528000, NULL, 'CANCELLED', 'Khách hàng thay đổi kế hoạch mua sắm.', '2026-06-18 11:20:00');

INSERT INTO order_items (order_item_id, order_id, product_id, product_name, product_sku, product_image, unit_price, quantity, total_price) VALUES
(1, 1, 1, 'ẨN: Mật Án Lệ Chi Viên', 'AN-BG-001', 'img/products/23.png', 329000, 1, 329000),
(2, 1, 3, 'Combo Thiên Tử', 'AN-CB-002', 'img/products/21.png', 699000, 1, 699000),
(3, 1, 7, 'Ly Sứ ẨN', 'AN-MD-003', 'img/products/6.png', 169000, 1, 169000),
(4, 2, 1, 'ẨN: Mật Án Lệ Chi Viên', 'AN-BG-001', 'img/products/23.png', 329000, 1, 329000),
(5, 3, 3, 'Combo Thiên Tử', 'AN-CB-002', 'img/products/21.png', 699000, 1, 699000),
(6, 3, 9, 'Bọc Thẻ Chống Xước', 'AN-PK-001', 'img/products/8.png', 99000, 1, 99000),
(7, 4, 4, 'Combo Hoàng Kim', 'AN-CB-003', 'img/products/22.png', 1099000, 1, 1099000),
(8, 4, 10, 'Bộ Xúc Xắc Đồng Cổ', 'AN-PK-002', 'img/products/10.png', 129000, 1, 129000),
(9, 5, 6, 'Túi Tote Vải Canvas ẨN', 'AN-MD-002', 'img/products/4.png', 199000, 1, 199000),
(10, 5, 7, 'Ly Sứ ẨN', 'AN-MD-003', 'img/products/6.png', 169000, 1, 169000);

-- 10. Thanh toán với đủ trạng thái chính
INSERT INTO payments (payment_id, order_id, payment_method, payment_provider, transaction_code, amount, status, paid_at, failed_reason) VALUES
(1, 1, 'COD', NULL, NULL, 1137000, 'PENDING', NULL, NULL),
(2, 2, 'COD', NULL, NULL, 359000, 'PENDING', NULL, NULL),
(3, 3, 'QR', 'MOCK_QR', 'QR202607090003', 728000, 'SUCCESS', '2026-07-09 14:25:00', NULL),
(4, 4, 'QR', 'MOCK_QR', 'QR202606280004', 1100000, 'SUCCESS', '2026-06-28 16:25:00', NULL),
(5, 5, 'MOCK_ONLINE', 'MOCK_GATEWAY', 'FAIL202606180005', 528000, 'FAILED', NULL, 'Giao dịch giả lập bị từ chối.');

-- 11. Hóa đơn bán hàng
INSERT INTO invoices (invoice_id, invoice_code, order_id, payment_id, invoice_date, subtotal, discount_amount, shipping_fee, total_amount, invoice_status, note) VALUES
(1, 'INV202607120001', 1, 1, '2026-07-12 08:31:00', 1227000, 90000, 0, 1137000, 'ISSUED', 'Hóa đơn COD đã lập, chờ thu tiền khi giao hàng.'),
(2, 'INV202607100002', 2, 2, '2026-07-10 10:17:00', 359000, 0, 0, 359000, 'ISSUED', 'Hóa đơn COD đã lập cho đơn đã xác nhận.'),
(3, 'INV202607090003', 3, 3, '2026-07-09 14:25:00', 748000, 50000, 30000, 728000, 'ISSUED', 'Hóa đơn thanh toán QR thành công.'),
(4, 'INV202606280004', 4, 4, '2026-06-28 16:25:00', 1250000, 150000, 0, 1100000, 'ISSUED', 'Hóa đơn cho đơn đã giao.'),
(5, 'INV202606180005', 5, 5, '2026-06-18 11:22:00', 498000, 0, 30000, 528000, 'CANCELLED', 'Hóa đơn hủy theo đơn hàng đã hủy.');

-- 12. Đổi/trả, đánh giá và blog
INSERT INTO return_requests (return_id, return_code, order_id, order_item_id, user_id, request_type, reason, evidence_image, status, admin_note, rejected_reason) VALUES
(1, 'RT202606290001', 4, 8, 4, 'RETURN', 'Một góc hộp bị móp trong quá trình vận chuyển.', 'img/products/15.png', 'APPROVED', 'Đã kiểm tra, chấp nhận hoàn và nhập lại kho.', NULL),
(2, 'RT202607120002', 1, 1, 1, 'EXCHANGE', 'Khách muốn đổi sang combo cao cấp hơn.', NULL, 'PENDING', NULL, NULL);

INSERT INTO reviews (review_id, product_id, user_id, order_item_id, rating, comment, review_image, status) VALUES
(1, 4, 4, 7, 5, 'Combo Hoàng Kim đóng gói kỹ, vật phẩm đẹp và rất hợp không khí trinh thám.', 'img/products/18.png', 'VISIBLE'),
(2, 10, 4, 8, 4, 'Xúc xắc cầm chắc tay, màu đồng cổ hợp với bàn chơi.', NULL, 'VISIBLE'),
(3, 1, 1, 1, 4, 'Cốt truyện cuốn hút, phù hợp nhóm thích suy luận lịch sử.', NULL, 'HIDDEN');

INSERT INTO blog_posts (post_id, title, slug, excerpt, content, featured_image, author_user_id, author_admin_id, approved_by_admin_id, status, admin_note, approved_at, published_at) VALUES
(1, 'Lệ Chi Viên và lớp sương của lịch sử', 'le-chi-vien-va-lop-suong-cua-lich-su', 'Khám phá bối cảnh lịch sử phía sau sản phẩm trọng tâm của ẨN Store.', 'Bài viết giới thiệu bối cảnh, nhân vật và cách đội ngũ chuyển chất liệu lịch sử thành trải nghiệm suy luận trên bàn chơi.', 'img/products/4.png', NULL, 1, 1, 'PUBLISHED', 'Bài viết do admin biên tập và tự duyệt.', '2026-06-24 07:45:00', '2026-06-24 08:00:00'),
(2, 'Hướng dẫn cách chơi ẨN cho nhóm mới', 'huong-dan-cach-choi-an-cho-nhom-moi', 'Các bước chuẩn bị, phân vai và đọc manh mối khi bắt đầu ván chơi.', 'Người chơi nên đọc luật, phân vai, kiểm tra hồ sơ nhân vật và ghi chú các lời khai quan trọng trước khi đưa ra giả thuyết.', 'img/products/14.png', NULL, 1, 1, 'PUBLISHED', 'Bài hướng dẫn chính thức của shop.', '2026-06-18 07:50:00', '2026-06-18 08:00:00'),
(3, 'Ván đầu tiên của nhóm tôi', 'van-dau-tien-cua-nhom-toi', 'Một chia sẻ trải nghiệm từ khách hàng sau khi chơi ẨN.', 'Nhóm chúng tôi mất gần hai giờ để phá án. Điều thú vị nhất là mỗi người đều có giả thuyết khác nhau nhưng phải cùng đối chiếu chứng cứ.', NULL, 2, NULL, NULL, 'PENDING', 'Bài user gửi, đang chờ admin duyệt.', NULL, NULL);


-- 13. Tồn kho cho từng sản phẩm
INSERT INTO inventories (inventory_id, product_id, stock_quantity, reserved_quantity, low_stock_threshold, status) VALUES
(1, 1, 22, 0, 5, 'IN_STOCK'),
(2, 2, 12, 0, 5, 'IN_STOCK'),
(3, 3, 8, 0, 5, 'IN_STOCK'),
(4, 4, 4, 0, 5, 'LOW_STOCK'),
(5, 5, 15, 0, 5, 'IN_STOCK'),
(6, 6, 18, 0, 5, 'IN_STOCK'),
(7, 7, 20, 0, 5, 'IN_STOCK'),
(8, 8, 30, 0, 5, 'IN_STOCK'),
(9, 9, 40, 0, 8, 'IN_STOCK'),
(10, 10, 24, 0, 5, 'IN_STOCK'),
(11, 11, 16, 0, 5, 'IN_STOCK'),
(12, 12, 0, 0, 5, 'OUT_OF_STOCK');

-- 14. Lịch sử biến động tồn kho: nhập kho, bán hàng, hủy đơn, hoàn hàng
INSERT INTO inventory_transactions (transaction_id, product_id, order_id, return_id, transaction_type, quantity_change, before_quantity, after_quantity, reason, created_by, created_at) VALUES
(1, 1, NULL, NULL, 'IMPORT', 30, 0, 30, 'Nhập kho đầu kỳ.', 1, '2026-06-01 08:00:00'),
(2, 3, NULL, NULL, 'IMPORT', 10, 0, 10, 'Nhập kho đầu kỳ.', 1, '2026-06-01 08:02:00'),
(3, 4, NULL, NULL, 'IMPORT', 6, 0, 6, 'Nhập kho đầu kỳ.', 1, '2026-06-01 08:03:00'),
(4, 7, NULL, NULL, 'IMPORT', 25, 0, 25, 'Nhập kho đầu kỳ.', 1, '2026-06-01 08:07:00'),
(5, 1, 4, NULL, 'SALE', -1, 30, 29, 'Xuất kho cho đơn AN202606280004.', NULL, '2026-06-28 16:25:00'),
(6, 10, 4, NULL, 'SALE', -1, 24, 23, 'Xuất kho cho đơn AN202606280004.', NULL, '2026-06-28 16:25:00'),
(7, 6, 5, NULL, 'SALE', -1, 18, 17, 'Xuất kho cho đơn AN202606180005 trước khi hủy.', NULL, '2026-06-18 11:22:00'),
(8, 6, 5, NULL, 'ORDER_CANCEL', 1, 17, 18, 'Hoàn kho do hủy đơn AN202606180005.', NULL, '2026-06-18 13:00:00'),
(9, 10, 4, 1, 'RETURN', 1, 23, 24, 'Nhập lại kho sau yêu cầu đổi/trả RT202606290001.', 1, '2026-06-29 16:00:00'),
(10, 4, NULL, NULL, 'ADJUSTMENT', -2, 6, 4, 'Điều chỉnh tồn kho sau kiểm kê.', 1, '2026-07-01 09:00:00');

-- Kết quả dữ liệu mẫu:
-- 1 admin, 5 khách hàng, 4 danh mục, 12 sản phẩm, 5 voucher, 5 đơn hàng,
-- payment có PENDING/SUCCESS/FAILED, invoice, tồn kho và lịch sử biến động đầy đủ.






