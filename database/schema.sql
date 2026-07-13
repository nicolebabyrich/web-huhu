-- ============================================================
-- AN STORE - CẤU TRÚC CƠ SỞ DỮ LIỆU
-- Hệ quản trị mục tiêu: MySQL 8.0+
-- Quy ước: tên bảng/cột bằng tiếng Anh, chú thích bằng tiếng Việt.
-- Lưu ý: users chỉ là khách hàng; admins là tài khoản quản trị shop online.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS inventories;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS return_requests;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS vouchers;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tài khoản khách hàng
CREATE TABLE users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Chỉ lưu mật khẩu đã được băm',
    date_of_birth DATE NULL,
    status ENUM('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tài khoản khách hàng; không lưu tài khoản quản trị';

-- 2. Tài khoản quản trị shop online
CREATE TABLE admins (
    admin_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Chỉ lưu mật khẩu đã được băm',
    role ENUM('SUPER_ADMIN','SHOP_ADMIN','CONTENT_ADMIN','SUPPORT_ADMIN') NOT NULL DEFAULT 'SHOP_ADMIN',
    status ENUM('ACTIVE','INACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tài khoản quản trị shop online, tách biệt hoàn toàn với users';

-- 3. Địa chỉ giao hàng
CREATE TABLE addresses (
    address_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NULL COMMENT 'Có thể để NULL với địa chỉ hành chính mới',
    ward VARCHAR(100) NOT NULL,
    detail_address VARCHAR(255) NOT NULL,
    address_label VARCHAR(50) NULL COMMENT 'Ví dụ: Nhà riêng, Công ty',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('ACTIVE','DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Các địa chỉ giao hàng của khách hàng';

-- 4. Danh mục sản phẩm
CREATE TABLE categories (
    category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('ACTIVE','HIDDEN') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh mục BoardGame, Combo, Merchandise và Phụ kiện';

-- 5. Sản phẩm
CREATE TABLE products (
    product_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    sku VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(12,2) NOT NULL,
    discount_price DECIMAL(12,2) NULL,
    description TEXT NULL,
    historical_period VARCHAR(150) NULL,
    game_type VARCHAR(150) NULL,
    player_count VARCHAR(50) NULL,
    age_rating TINYINT UNSIGNED NULL,
    duration VARCHAR(50) NULL,
    difficulty_level ENUM('EASY','MEDIUM','HARD','EXPERT') NOT NULL DEFAULT 'MEDIUM',
    components TEXT NULL,
    story_summary TEXT NULL,
    status ENUM('ACTIVE','OUT_OF_STOCK','HIDDEN','DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT chk_product_price CHECK (price >= 0),
    CONSTRAINT chk_product_discount CHECK (discount_price IS NULL OR discount_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Thông tin sản phẩm board game và hàng hóa liên quan';

-- 6. Hình ảnh sản phẩm
CREATE TABLE product_images (
    image_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL COMMENT 'Ưu tiên đường dẫn local trong img/products',
    alt_text VARCHAR(255) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Danh sách hình ảnh của từng sản phẩm';

-- 7. Giỏ hàng
CREATE TABLE carts (
    cart_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('ACTIVE','CHECKED_OUT','ABANDONED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Giỏ hàng của khách hàng';

-- 8. Chi tiết giỏ hàng
CREATE TABLE cart_items (
    cart_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL COMMENT 'Giá tham chiếu, kiểm tra lại khi checkout',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id),
    CONSTRAINT chk_cart_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Các sản phẩm đang nằm trong giỏ hàng';

-- 9. Chương trình khuyến mãi
CREATE TABLE promotions (
    promotion_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    promotion_name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    banner_image VARCHAR(500) NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('ACTIVE','INACTIVE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_promotion_time CHECK (end_date >= start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Chiến dịch ưu đãi và nội dung truyền thông';

-- 10. Voucher
CREATE TABLE vouchers (
    voucher_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    promotion_id BIGINT UNSIGNED NULL,
    voucher_code VARCHAR(50) NOT NULL UNIQUE,
    voucher_name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    discount_type ENUM('PERCENT','FIXED') NOT NULL,
    discount_value DECIMAL(12,2) NOT NULL,
    max_discount_amount DECIMAL(12,2) NULL,
    min_order_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    usage_limit INT UNSIGNED NULL COMMENT 'NULL nghĩa là không giới hạn tổng lượt',
    used_count INT UNSIGNED NOT NULL DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status ENUM('ACTIVE','INACTIVE','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vouchers_promotion FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id),
    CONSTRAINT chk_voucher_time CHECK (end_date >= start_date),
    CONSTRAINT chk_voucher_discount CHECK (discount_value > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Mã giảm giá áp dụng trong checkout';

-- 11. Đơn hàng
CREATE TABLE orders (
    order_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    voucher_id BIGINT UNSIGNED NULL,
    voucher_code VARCHAR(50) NULL COMMENT 'Mã voucher tại thời điểm mua',
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100) NULL,
    ward VARCHAR(100) NOT NULL,
    detail_address VARCHAR(255) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(12,2) NOT NULL,
    note VARCHAR(255) NULL,
    status ENUM('PENDING','CONFIRMED','SHIPPING','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    cancel_reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(voucher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Đơn hàng và thông tin giao nhận tại thời điểm đặt';

-- 12. Chi tiết đơn hàng
CREATE TABLE order_items (
    order_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    product_image VARCHAR(500) NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT chk_order_item_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sản phẩm và giá trong từng đơn hàng';

-- 13. Thanh toán
CREATE TABLE payments (
    payment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL UNIQUE,
    payment_method ENUM('COD','QR','BANK_TRANSFER','MOCK_ONLINE') NOT NULL DEFAULT 'COD',
    payment_provider VARCHAR(100) NULL,
    transaction_code VARCHAR(100) NULL,
    amount DECIMAL(12,2) NOT NULL,
    status ENUM('PENDING','SUCCESS','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_at DATETIME NULL,
    failed_reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Kết quả thanh toán giả lập của đơn hàng';

-- 14. Hóa đơn bán hàng
CREATE TABLE invoices (
    invoice_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_code VARCHAR(30) NOT NULL UNIQUE,
    order_id BIGINT UNSIGNED NOT NULL UNIQUE,
    payment_id BIGINT UNSIGNED NOT NULL UNIQUE,
    invoice_date DATETIME NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    invoice_status ENUM('ISSUED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'ISSUED',
    note VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoices_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_invoices_payment FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Hóa đơn bán hàng phát sinh từ đơn hàng và thanh toán tương ứng';

-- 15. Yêu cầu đổi/trả
CREATE TABLE return_requests (
    return_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    return_code VARCHAR(30) NOT NULL UNIQUE,
    order_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    request_type ENUM('RETURN','EXCHANGE') NOT NULL,
    reason VARCHAR(255) NOT NULL,
    evidence_image VARCHAR(500) NULL,
    status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
    admin_note VARCHAR(255) NULL,
    rejected_reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_returns_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_returns_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
    CONSTRAINT fk_returns_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Yêu cầu đổi hoặc trả sản phẩm thuộc đơn đã giao';

-- 16. Đánh giá sản phẩm
CREATE TABLE reviews (
    review_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT NULL,
    review_image VARCHAR(500) NULL,
    status ENUM('VISIBLE','HIDDEN') NOT NULL DEFAULT 'VISIBLE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_reviews_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Đánh giá từ khách hàng đã mua sản phẩm';

-- 17. Bài viết blog
CREATE TABLE blog_posts (
    post_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    excerpt VARCHAR(500) NULL,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500) NULL,
    author_user_id BIGINT UNSIGNED NULL COMMENT 'Người dùng viết bài, nếu bài do user tạo',
    author_admin_id BIGINT UNSIGNED NULL COMMENT 'Admin viết bài, nếu bài do admin tạo',
    approved_by_admin_id BIGINT UNSIGNED NULL COMMENT 'Admin duyệt bài viết',
    status ENUM('DRAFT','PENDING','PUBLISHED','REJECTED','HIDDEN') NOT NULL DEFAULT 'DRAFT',
    admin_note VARCHAR(500) NULL,
    approved_at DATETIME NULL,
    published_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_blog_posts_author_user FOREIGN KEY (author_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_blog_posts_author_admin FOREIGN KEY (author_admin_id) REFERENCES admins(admin_id),
    CONSTRAINT fk_blog_posts_approved_admin FOREIGN KEY (approved_by_admin_id) REFERENCES admins(admin_id),
    CONSTRAINT chk_blog_author CHECK (
        (author_user_id IS NOT NULL AND author_admin_id IS NULL)
        OR (author_user_id IS NULL AND author_admin_id IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bài viết blog do admin hoặc user tạo, có phân tách người viết và người duyệt';


-- 18. Tồn kho hiện tại
CREATE TABLE inventories (
    inventory_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL UNIQUE,
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    reserved_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    available_quantity INT GENERATED ALWAYS AS (stock_quantity - reserved_quantity) STORED,
    low_stock_threshold INT UNSIGNED NOT NULL DEFAULT 5,
    status ENUM('IN_STOCK','LOW_STOCK','OUT_OF_STOCK','INACTIVE') NOT NULL DEFAULT 'IN_STOCK',
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventories_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT chk_inventory_reserved CHECK (reserved_quantity <= stock_quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Số lượng tồn kho hiện tại của từng sản phẩm';

-- 19. Lịch sử biến động tồn kho
CREATE TABLE inventory_transactions (
    transaction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    return_id BIGINT UNSIGNED NULL,
    transaction_type ENUM('IMPORT','SALE','ORDER_CANCEL','RETURN','ADJUSTMENT') NOT NULL,
    quantity_change INT NOT NULL,
    before_quantity INT UNSIGNED NOT NULL,
    after_quantity INT UNSIGNED NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_by BIGINT UNSIGNED NULL COMMENT 'Admin thực hiện; NULL nếu hệ thống tự động tạo',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_transactions_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_inventory_transactions_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_inventory_transactions_return FOREIGN KEY (return_id) REFERENCES return_requests(return_id),
    CONSTRAINT fk_inventory_transactions_admin FOREIGN KEY (created_by) REFERENCES admins(admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sổ lịch sử nhập, bán, hủy, hoàn và điều chỉnh tồn kho';

-- Ghi chú nghiệp vụ:
-- 1. Không giảm tồn kho khi thêm sản phẩm vào giỏ hàng.
-- 2. Tồn kho chỉ giảm sau khi thanh toán/đặt hàng thành công theo luồng checkout.
-- 3. Khi hủy đơn hoặc hoàn hàng đủ điều kiện, hệ thống cộng lại tồn kho và ghi inventory_transactions.
-- 4. users và admins tách riêng để tránh trộn quyền khách hàng và quản trị.



