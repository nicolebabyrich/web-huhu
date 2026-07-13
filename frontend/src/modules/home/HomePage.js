import {
  BlogCard,
  CategoryCard,
  NewsletterForm,
  ProductCard,
  PromotionBanner,
  SectionTitle
} from "../../components/index.js";
import { blogPosts, categories } from "../../data/catalog.js";
import { getProducts } from "../../services/store.js";
import { escapeHtml } from "../../utils/format.js";
import { productUrl, ROUTES } from "../../utils/routes.js";

const characterProfiles = [
  { title: "Ức Trai Tiên Sinh", displayTitle: "Ức Trai<br>Tiên Sinh", image: "/img/profile/nhanvat%20%40uctraitiensinh.png", model3d: "/img/3d/profile/uc-trai-tien-sinh.glb", story: "Nguyễn Trãi giữ vai trò người chứng quan trọng trong vụ án Lệ Chi Viên. Những ghi chép và mật thư ông để lại có thể mở ra manh mối quyết định." },
  { title: "Lễ Nghi Học Sĩ", displayTitle: "Lễ Nghi<br>Học Sĩ", image: "/img/profile/nhanvat%20%40lenghihocsi.png", model3d: "/img/3d/profile/le-nghi-hoc-si.glb", story: "Nguyễn Thị Lộ là nhân vật ở gần trung tâm biến cố. Sự am hiểu lễ nghi và những chi tiết bất thường trong đêm án mạng khiến hồ sơ của bà cần được đọc thật kỹ." },
  { title: "Mẫu Nghi Thiên Hạ", displayTitle: "Mẫu Nghi<br>Thiên Hạ", image: "/img/profile/nhanvat%20%40maunghithienha.png", model3d: "/img/3d/profile/mau-nghi-thien-ha.glb", story: "Người đứng ở vị trí mẫu nghi nắm giữ quyền lực hậu cung và nhiều mối quan hệ kín. Đằng sau dáng vẻ điềm tĩnh là những động cơ cần được điều tra." },
  { title: "Cận Vệ Hoàng Cung", displayTitle: "Cận Vệ<br>Hoàng Cung", image: "/img/profile/nhanvat%20%40canvehoangcung.png", model3d: "/img/3d/profile/can-ve-hoang-cung.glb", story: "Cận vệ hoàng cung kiểm soát lối ra vào và lịch trình canh phòng. Lời khai của nhân vật này có thể xác định ai đã xuất hiện gần hiện trường." },
  { title: "Tướng Quân Cấm Vệ Binh", displayTitle: "Tướng Quân<br>Cấm Vệ Binh", image: "/img/profile/nhanvat%20%40tuongquancamvebinh.png", model3d: "/img/3d/profile/tuong-quan-cam-ve-binh.glb", story: "Vị tướng cấm vệ binh nắm binh quyền và bảo vệ vòng ngoài hoàng cung. Một dấu vết trên vũ khí của ông có thể liên kết nhiều bí mật bị che giấu." }
];

function CharacterProfileSection() {
  return `<section class="section section--paper"><div class="container">${SectionTitle({ eyebrow: "Sưu tầm", title: "Hồ sơ nhân vật: Mật Án Lệ Chi Viên", description: "Chạm vào từng nhân vật để mở lớp tâm lý ẩn giấu phía sau vụ án." })}<div class="character-carousel">${characterProfiles.map((item, index) => `<button class="character-card" type="button" data-action="open-character-profile" data-character-title="${escapeHtml(item.title)}" data-character-story="${escapeHtml(item.story)}" data-character-image="${escapeHtml(item.image)}" data-character-model="${escapeHtml(item.model3d || "")}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy"><span>Nhân vật ${index + 1}</span><strong>${item.displayTitle}</strong><small>Mở hồ sơ</small></button>`).join("")}</div></div></section>`;
}
export function HomePage() {
  const allProducts = getProducts();
  const featured = allProducts.filter((product) => product.featured).slice(0, 4);
  const categoryImages = {
    boardgame: "/img/products/23.png",
    combo: "/img/products/21.png",
    merchandise: "/img/products/5.png",
    accessory: "/img/products/12.png"
  };
  const visibleCategories = categories.filter((category) => category.id !== "all");

  return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="container hero-content">
        <p class="hero-kicker">Vietnamese historical mystery board game</p>
        <h1 id="hero-title">Lịch sử chưa bao giờ chỉ có một lời kể.</h1>
        <p class="hero-lead">Mở hồ sơ, đối chiếu lời khai và bước vào những biến cố Đại Việt bằng trải nghiệm suy luận giàu nhập vai.</p>
        <div class="button-row">
          <a class="button button--primary" href="${productUrl(1)}">Mở Mật Án Lệ Chi Viên</a>
          <a class="button button--secondary" href="${ROUTES.products}">Khám phá kho hồ sơ</a>
        </div>
        <div class="hero-facts" aria-label="Thông tin nổi bật">
          <span class="hero-fact"><strong>3-6</strong><span>Điều tra viên</span></span>
          <span class="hero-fact"><strong>90′</strong><span>Thời lượng</span></span>
          <span class="hero-fact"><strong>13+</strong><span>Độ tuổi</span></span>
          <span class="hero-fact"><strong>01</strong><span>Sự thật ẩn giấu</span></span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container intro-grid">
        <div>
          <p class="eyebrow">Về ẨN Store</p>
          <h2>Biến giai thoại thành trải nghiệm trên bàn chơi</h2>
          <p>ẨN Store xây dựng một vũ trụ board game trinh thám, nơi lịch sử được nhìn qua chứng cứ, động cơ và những lời khai chưa trọn vẹn.</p>
          <p class="muted">Chúng tôi giữ tinh thần vintage của hồ sơ cổ, kết hợp cơ chế hiện đại để mỗi ván chơi vừa có chiều sâu tri thức, vừa đủ kịch tính để cả nhóm cùng tranh luận.</p>
          <div class="value-list">
            <div class="value-item"><span class="value-number">01</span><div><h3>Chất lượng sưu tầm</h3><p class="muted">Hình ảnh, thẻ và phụ kiện được tổ chức như một bộ hồ sơ hoàn chỉnh.</p></div></div>
            <div class="value-item"><span class="value-number">02</span><div><h3>Trải nghiệm phá án</h3><p class="muted">Quan sát, suy luận, nhập vai và đối đầu tâm lý trong cùng một nhịp chơi.</p></div></div>
            <div class="value-item"><span class="value-number">03</span><div><h3>Cộng đồng điều tra</h3><p class="muted">Mỗi nhóm chơi có thể đi đến một cách lý giải khác nhau.</p></div></div>
          </div>
        </div>
        <div class="intro-visual">
          <img src="/img/products/9.png" alt="Standee dàn nhân vật ẨN Store" loading="lazy">
          <aside class="visual-note"><strong>“Mỗi nhân chứng giữ một mảnh sự thật.”</strong><p class="muted">- Hồ sơ lưu trữ số 1442</p></aside>
        </div>
      </div>
    </section>

    <section class="section section--paper">
      <div class="container">
        ${SectionTitle({
          eyebrow: "Kho lưu trữ",
          title: "Sản phẩm nổi bật",
          description: "Những bộ hồ sơ được lựa chọn cho hành trình đầu tiên vào thế giới ẨN.",
          actionLabel: "Xem tất cả sản phẩm",
          actionHref: ROUTES.products
        })}
        <div class="product-grid">${featured.map(ProductCard).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="container story-grid">
        <div class="story-visual">
          <img src="/img/products/23.png" alt="Board game ẨN: Mật Án Lệ Chi Viên" loading="lazy">
        </div>
        <div>
          <p class="eyebrow">Hồ sơ trọng điểm</p>
          <h2>ẨN: Mật Án Lệ Chi Viên</h2>
          <p>Năm 1442, một cái chết trong đêm làm rung chuyển triều đình. Lời khai chồng chéo, vật chứng bị dịch chuyển và mỗi nhân vật đều có lý do để giữ im lặng.</p>
          <p class="muted">Bạn không chỉ giải đố. Bạn phải đọc động cơ, lựa chọn người đáng tin và bảo vệ kết luận của mình trước những điều tra viên khác.</p>
          <div class="product-specs">
            <div class="spec-item"><span>Bối cảnh</span><strong>Đại Việt thế kỷ XV</strong></div>
            <div class="spec-item"><span>Cơ chế</span><strong>Suy luận & ẩn vai</strong></div>
            <div class="spec-item"><span>Người chơi</span><strong>3-6 người</strong></div>
            <div class="spec-item"><span>Độ khó</span><strong>Khó</strong></div>
          </div>
          <div class="button-row">
            <a class="button button--primary" href="${productUrl(1)}">Xem chi tiết hồ sơ</a>
            <button class="button button--secondary" type="button" data-action="add-to-cart" data-product-id="1">Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--paper">
      <div class="container">
        ${SectionTitle({
          eyebrow: "Bốn ngăn lưu trữ",
          title: "Duyệt theo danh mục",
          description: "Từ board game cốt lõi đến các vật phẩm hoàn thiện không khí bàn chơi."
        })}
        <div class="category-grid">
          ${visibleCategories.map((category) => CategoryCard(
            category,
            categoryImages[category.id],
            allProducts.filter((product) => product.category === category.id).length
          )).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">${PromotionBanner()}</div>
    </section>

    ${CharacterProfileSection()}

    <section class="section section--paper">
      <div class="container">
        ${SectionTitle({
          eyebrow: "Biên bản & giai thoại",
          title: "Từ phòng lưu trữ",
          description: "Những câu chuyện phía sau lịch sử, thiết kế và nghệ thuật suy luận.",
          actionLabel: "Xem toàn bộ bài viết",
          actionHref: ROUTES.home
        })}
        <div class="blog-grid">${blogPosts.filter((post) => post.status === "PUBLISHED").map(BlogCard).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="container newsletter">
        <div>
          <p class="eyebrow">Nhận mật thư</p>
          <h2 class="newsletter-title"><span>Hồ sơ mới sẽ được gửi</span><span>đến trước khi</span><span>niêm phong.</span></h2>
          <p class="muted">Đăng ký để nhận thông tin phát hành, sự kiện cộng đồng và mã ưu đãi giới hạn.</p>
        </div>
        ${NewsletterForm()}
      </div>
    </section>
  `;
}









