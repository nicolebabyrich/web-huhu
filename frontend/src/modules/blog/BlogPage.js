import { BlogCard, EmptyState, SectionTitle, BootstrapIcon } from "../../components/index.js";
import { getCurrentUser, getPublishedBlogs, submitUserBlog } from "../../services/store.js";
import { escapeHtml } from "../../utils/format.js";
import { redirectTo, ROUTES, withQuery } from "../../utils/routes.js";

export function BlogPage() {
  const user = getCurrentUser();
  const posts = getPublishedBlogs();
  return `
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Đường dẫn"><a href="${ROUTES.home}">Trang chủ</a><span>/</span><span>Blog</span></nav>
        <p class="eyebrow">Nhật ký điều tra</p>
        <h1>Blog cộng đồng ẨN</h1>
        <p class="muted">Nơi người chơi chia sẻ trải nghiệm phá án, chiến thuật phối hợp và cảm nhận sau mỗi ván board game.</p>
      </div>
    </section>

    <section class="section">
      <div class="container blog-layout">
        <div>
          ${SectionTitle({ eyebrow: "Bài viết", title: "Hồ sơ đã công bố", description: "Bài viết từ ẨN Store và cộng đồng sau khi được duyệt." })}
          ${posts.length ? `<div class="blog-grid">${posts.map(BlogCard).join("")}</div>` : EmptyState({ title: "Chưa có bài viết", description: "Hãy gửi chia sẻ đầu tiên về trải nghiệm chơi ẨN." })}
        </div>

        <aside class="surface account-panel blog-submit-panel">
          <p class="eyebrow">Chia sẻ trải nghiệm</p>
          <h2>Gửi bài blog của bạn</h2>
          ${user ? `
            <p class="muted">Bài viết sẽ ở trạng thái chờ duyệt. Bạn có thể thêm hoặc không thêm ảnh minh họa.</p>
            <ul class="blog-submit-hints">
              <li>Nội dung nên kể trải nghiệm chơi, cách suy luận hoặc khoảnh khắc đáng nhớ.</li>
              <li>Hệ thống sẽ kiểm tra từ ngữ không phù hợp trước khi gửi duyệt.</li>
            </ul>
            <button class="button button--primary blog-open-modal" type="button" data-blog-modal-open>${BootstrapIcon("journal-text")} Mở khung viết bài</button>
            <p class="form-message" id="blog-message"></p>
          ` : `
            ${EmptyState({ title: "Cần đăng nhập", description: "Đăng nhập để gửi bài chia sẻ trải nghiệm chơi board game.", actionLabel: "Đăng nhập", actionHref: withQuery(ROUTES.login, { redirect: ROUTES.blog }) })}
          `}
        </aside>
        ${user ? blogSubmitModal() : ""}
      </div>
    </section>
  `;
}


function blogSubmitModal() {
  return `
    <div class="modal-backdrop blog-modal-backdrop is-hidden" data-blog-modal aria-hidden="true">
      <article class="modal info-modal blog-compose-modal" role="dialog" aria-modal="true" aria-labelledby="blog-compose-title">
        <button class="modal-close" type="button" aria-label="Đóng khung viết bài" data-blog-modal-close>×</button>
        <p class="eyebrow">Nhật ký điều tra</p>
        <h2 id="blog-compose-title">Gửi bài blog của bạn</h2>
        <p class="muted">Viết thoải mái hơn trong khung lớn. Ảnh minh họa là tùy chọn.</p>
        <form id="user-blog-form" class="form-grid blog-compose-form" novalidate>
          <input type="hidden" name="imageName">
          <label class="form-field form-field--full"><span class="form-label">Tiêu đề</span><input class="form-control" name="title" minlength="8" required placeholder="Ví dụ: Ván án đầu tiên của nhóm mình"></label>
          <label class="form-field form-field--full"><span class="form-label">Tóm tắt ngắn <small>(tùy chọn)</small></span><input class="form-control" name="excerpt" maxlength="180" placeholder="Một câu dẫn cho bài chia sẻ"></label>
          <label class="form-field form-field--full"><span class="form-label">Nội dung trải nghiệm</span><textarea class="form-control blog-compose-textarea" name="content" minlength="5" required placeholder="Kể lại cách nhóm phân vai, suy luận, những khoảnh khắc bất ngờ..."></textarea></label>
          <label class="form-field form-field--full"><span class="form-label">Ảnh minh họa <small>(tùy chọn)</small></span><input class="form-control" type="file" name="imageFile" accept="image/*"><small class="muted">Demo chỉ lấy tên file. Khi nộp thật, đặt ảnh vào thư mục img/products/ hoặc thư mục blog nếu tạo thêm.</small></label>
          <div class="button-row form-field--full blog-compose-actions"><button class="button button--ghost" type="button" data-blog-modal-close>Để sau</button><button class="button button--primary" type="submit">Gửi bài chờ duyệt</button></div>
        </form>
      </article>
    </div>
  `;
}
function blogMessage(message, success = false) {
  const target = document.querySelector("#blog-message");
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("form-message--success", success);
}

export function mountBlogPage(render) {
  const modal = document.querySelector("[data-blog-modal]");
  const openModal = () => {
    modal?.classList.remove("is-hidden");
    modal?.setAttribute("aria-hidden", "false");
    setTimeout(() => modal?.querySelector("[name='title']")?.focus(), 0);
  };
  const closeModal = () => {
    modal?.classList.add("is-hidden");
    modal?.setAttribute("aria-hidden", "true");
  };

  document.querySelector("[data-blog-modal-open]")?.addEventListener("click", openModal);
  document.querySelectorAll("[data-blog-modal-close]").forEach((button) => button.addEventListener("click", closeModal));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal?.classList.contains("is-hidden")) closeModal();
  });

  document.querySelector('[name="imageFile"]')?.addEventListener("change", (event) => {
    const file = event.currentTarget.files?.[0];
    const form = document.querySelector("#user-blog-form");
    if (file && form?.elements.imageName) {
      form.elements.imageName.value = file.name;
      blogMessage("Đã nhận ảnh " + file.name + ". Ảnh sẽ được dùng sau khi bài viết được duyệt.", true);
    }
  });

  document.querySelector("#user-blog-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      submitUserBlog(Object.fromEntries(new FormData(event.currentTarget)));
      event.currentTarget.reset();
      closeModal();
      blogMessage("Đã gửi bài viết. Admin sẽ duyệt trước khi công bố trên Blog.", true);
    } catch (error) {
      blogMessage(error.message);
    }
  });
}

