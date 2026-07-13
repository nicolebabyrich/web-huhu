import { BootstrapIcon, Button, EmptyState } from "../../components/index.js";
import {
  completePasswordReset,
  deleteAddress,
  getCurrentUser,
  getUserAddresses,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  requestPasswordReset,
  verifyPasswordReset,
  saveAddress,
  setDefaultAddress,
  updateProfile
} from "../../services/store.js";
import { escapeHtml, isValidDateOfBirth, isValidEmail, isValidName, isValidPhone, maxBirthDateForAge } from "../../utils/format.js";
import { redirectTo, ROUTES } from "../../utils/routes.js";
import { getProvinces, getWards } from "../../services/addressService.js";

function authVisual() {
  return `<div class="auth-visual" aria-hidden="true"><img src="/img/products/23.png" alt=""></div>`;
}

function maxBirthDateValue() {
  return maxBirthDateForAge(13);
}

export function LoginPage() {
  return `
    <section class="auth-shell">
      ${authVisual()}
      <div class="auth-panel">
        <div class="auth-card">
          <p class="eyebrow">Khách hàng</p>
          <h1>Mở lại hồ sơ của bạn</h1>
          <form id="login-form" class="form-grid" novalidate>
            <label class="form-field form-field--full"><span class="form-label">Email hoặc số điện thoại</span><input class="form-control" type="text" name="identifier" autocomplete="username" inputmode="email" required value="oanhntkk24411@st.uel.edu.vn"></label>
            <label class="form-field form-field--full password-field"><span class="form-label">Mật khẩu</span><span class="password-input-wrap"><input class="form-control" type="password" name="password" autocomplete="current-password" required value="0704477397"><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Hiện mật khẩu" aria-pressed="false"><span class="password-toggle__icon" data-password-eye>${BootstrapIcon("eye")}</span><span class="password-toggle__icon is-hidden" data-password-eye-off>${BootstrapIcon("eye-slash")}</span></button></span></label>
            <p class="form-message form-field--full" id="auth-message"></p>
            <button class="button button--primary form-field--full" type="submit">Đăng nhập</button>
          </form>
          <div class="button-row">
            <a class="nav-link" href="${ROUTES.forgotPassword}">Quên mật khẩu?</a>
            <a class="nav-link" href="${ROUTES.register}">Tạo tài khoản mới</a>
            <a class="nav-link" href="${ROUTES.adminLogin}">Đăng nhập Admin</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function RegisterPage() {
  return `
    <section class="auth-shell">
      ${authVisual()}
      <div class="auth-panel">
        <div class="auth-card">
          <p class="eyebrow">Thành viên mới</p>
          <h1>Gia nhập mạng lưới điều tra</h1>
          <form id="register-form" class="form-grid" novalidate>
            <label class="form-field form-field--full"><span class="form-label">Họ và tên</span><input class="form-control" name="fullName" autocomplete="name" minlength="2" maxlength="100" required></label>
            <label class="form-field"><span class="form-label">Email</span><input class="form-control" type="email" name="email" autocomplete="email" required></label>
            <label class="form-field"><span class="form-label">Số điện thoại</span><input class="form-control" name="phone" autocomplete="tel" inputmode="numeric" maxlength="10" pattern="0[35789][0-9]{8}" placeholder="0901234567" required></label>
            <label class="form-field"><span class="form-label">Ngày sinh</span><input class="form-control" type="date" name="dateOfBirth" max="${maxBirthDateValue()}"></label>
            <label class="form-field"><span class="form-label">Mật khẩu</span><input class="form-control" type="password" name="password" autocomplete="new-password" minlength="8" required></label>
            <p class="form-message form-field--full" id="auth-message"></p>
            <button class="button button--primary form-field--full" type="submit">Đăng ký</button>
          </form>
          <a class="nav-link" href="${ROUTES.login}">Đã có tài khoản? Đăng nhập</a>
        </div>
      </div>
    </section>
  `;
}

export function ForgotPasswordPage() {
  return `
    <section class="auth-shell forgot-password-shell">
      ${authVisual()}
      <div class="auth-panel">
        <div class="auth-card forgot-password-card">
          <p class="eyebrow">Khôi phục truy cập</p>
          <h1>Quên mật khẩu</h1>
          <p class="muted">Luồng demo mô phỏng gửi thư đặt lại mật khẩu. Email thực tế không được gửi; mã xác thực sẽ hiện trực tiếp trên màn hình.</p>
          <ol class="reset-steps" aria-label="Quy trình đặt lại mật khẩu">
            <li class="is-active" data-reset-step-label="request">Nhập tài khoản</li>
            <li data-reset-step-label="verify">Xác thực mã</li>
            <li data-reset-step-label="complete">Tạo mật khẩu mới</li>
          </ol>
          <form id="forgot-form" class="form-grid" novalidate data-reset-step="request">
            <input type="hidden" name="token">
            <section class="reset-step-panel" data-reset-panel="request">
              <label class="form-field form-field--full"><span class="form-label">Email hoặc số điện thoại đăng ký</span><input class="form-control" type="text" name="identifier" autocomplete="username" inputmode="email" required placeholder="email@domain.com hoặc 0901234567"></label>
              <button class="button button--primary form-field--full" type="submit">Tạo mã đặt lại</button>
            </section>
            <section class="reset-step-panel is-hidden" data-reset-panel="verify">
              <div class="reset-demo-code" role="status"><span>Mã demo</span><strong id="reset-demo-code">------</strong><small>Có hiệu lực 15 phút và chỉ dùng một lần.</small></div>
              <label class="form-field form-field--full"><span class="form-label">Nhập mã xác thực</span><input class="form-control" name="code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" placeholder="6 chữ số"></label>
              <div class="button-row form-field--full"><button class="button button--primary" type="submit">Xác thực mã</button><button class="button button--ghost" type="button" data-action="reset-password-restart">Yêu cầu mã mới</button></div>
            </section>
            <section class="reset-step-panel is-hidden" data-reset-panel="complete">
              <label class="form-field form-field--full password-field"><span class="form-label">Mật khẩu mới</span><span class="password-input-wrap"><input class="form-control" type="password" name="password" autocomplete="new-password" minlength="8"><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Hiện mật khẩu" aria-pressed="false"><span class="password-toggle__icon" data-password-eye>${BootstrapIcon("eye")}</span><span class="password-toggle__icon is-hidden" data-password-eye-off>${BootstrapIcon("eye-slash")}</span></button></span></label>
              <label class="form-field form-field--full password-field"><span class="form-label">Xác nhận mật khẩu mới</span><span class="password-input-wrap"><input class="form-control" type="password" name="confirmPassword" autocomplete="new-password" minlength="8"><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Hiện mật khẩu" aria-pressed="false"><span class="password-toggle__icon" data-password-eye>${BootstrapIcon("eye")}</span><span class="password-toggle__icon is-hidden" data-password-eye-off>${BootstrapIcon("eye-slash")}</span></button></span></label>
              <button class="button button--primary form-field--full" type="submit">Cập nhật mật khẩu</button>
            </section>
            <p class="form-message form-field--full" id="auth-message"></p>
          </form>
          <a class="nav-link" href="${ROUTES.login}">Quay lại đăng nhập</a>
        </div>
      </div>
    </section>
  `;
}

export function AccountPage() {
  const user = getCurrentUser();
  if (!user) {
    return `<section class="section"><div class="container">${EmptyState({ title: "Cần đăng nhập", description: "Đăng nhập để quản lý hồ sơ và địa chỉ giao hàng.", actionLabel: "Đăng nhập", actionHref: ROUTES.login, symbol: "◎" })}</div></section>`;
  }
  const addresses = getUserAddresses();
  return `
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Hồ sơ khách hàng</p>
        <h1>Xin chào, ${escapeHtml(user.fullName)}</h1>
        <p class="muted">Quản lý thông tin nhận diện và địa chỉ nhận hồ sơ.</p>
      </div>
    </section>
    <section class="section">
      <div class="container account-layout">
        <nav class="account-nav surface" aria-label="Tài khoản">
          <button class="is-active" type="button" data-account-target="profile">Thông tin cá nhân</button>
          <button type="button" data-account-target="addresses">Địa chỉ giao hàng</button>
          <a href="${ROUTES.orders}">Đơn hàng của tôi</a>
          <button class="button button--ghost button--small" type="button" data-action="logout-customer">Đăng xuất</button>
        </nav>
        <div>
          <section class="account-panel surface" id="profile">
            <div class="address-card__header"><div><p class="eyebrow">Thông tin cá nhân</p><h2>Hồ sơ tài khoản</h2></div></div>
            <form id="profile-form" class="form-grid">
              <label class="form-field form-field--full"><span class="form-label">Họ và tên</span><input class="form-control" name="fullName" value="${escapeHtml(user.fullName)}" minlength="2" maxlength="100" required></label>
              <label class="form-field"><span class="form-label">Email</span><input class="form-control" type="email" name="email" value="${escapeHtml(user.email)}" maxlength="254" required></label>
              <label class="form-field"><span class="form-label">Số điện thoại</span><input class="form-control" name="phone" value="${escapeHtml(user.phone)}" inputmode="numeric" maxlength="10" pattern="0[35789][0-9]{8}" required></label>
              <label class="form-field"><span class="form-label">Ngày sinh</span><input class="form-control" type="date" name="dateOfBirth" value="${escapeHtml(user.dateOfBirth || "")}" max="${maxBirthDateValue()}"></label>
              <p class="form-message form-field--full" id="profile-message"></p>
              <button class="button button--primary" type="submit">Lưu thay đổi</button>
            </form>
          </section>

          <section class="account-panel surface" id="addresses">
            <p class="eyebrow">Giao nhận</p>
            <h2>Địa chỉ giao hàng</h2>
            <div class="address-list">
              ${addresses.length ? addresses.map((address) => `
                <article class="address-card surface">
                  <div class="address-card__header">
                    <div><h3>${escapeHtml(address.label)}</h3>${address.isDefault ? '<span class="default-badge">Địa chỉ mặc định</span>' : ""}</div>
                    <div class="button-row">
                      <button class="button button--ghost button--small" type="button" data-action="edit-address" data-address-id="${address.id}">Sửa</button>
                      ${!address.isDefault ? `<button class="button button--ghost button--small" type="button" data-action="default-address" data-address-id="${address.id}">Đặt mặc định</button>` : ""}
                      <button class="button button--danger button--small" type="button" data-action="delete-address" data-address-id="${address.id}">Xóa</button>
                    </div>
                  </div>
                  <p><strong>${escapeHtml(address.receiverName)}</strong> · ${escapeHtml(address.receiverPhone)}</p>
                  <p class="muted">${escapeHtml([address.detailAddress, address.ward, address.district, address.province].filter(Boolean).join(", "))}</p>
                </article>
              `).join("") : '<p class="muted">Bạn chưa có địa chỉ giao hàng.</p>'}
            </div>
            <hr>
            <h3 id="address-form-title">Thêm địa chỉ</h3>
            <form id="address-form" class="form-grid">
              <input type="hidden" name="id">
              <label class="form-field"><span class="form-label">Tên người nhận</span><input class="form-control" name="receiverName" value="${escapeHtml(user.fullName)}" minlength="2" maxlength="100" required></label>
              <label class="form-field"><span class="form-label">Số điện thoại</span><input class="form-control" name="receiverPhone" value="${escapeHtml(user.phone)}" inputmode="numeric" maxlength="10" pattern="0[35789][0-9]{8}" placeholder="0901234567" required></label>
              <label class="form-field"><span class="form-label">Tỉnh / Thành phố</span><select class="form-control" name="province" id="province-select" required><option value="">Đang tải dữ liệu...</option></select></label>
              <label class="form-field"><span class="form-label">Quận / Huyện <small>(tùy chọn)</small></span><input class="form-control" name="district" maxlength="100" placeholder="Dùng cho địa chỉ hành chính cũ"></label>
              <label class="form-field"><span class="form-label">Phường / Xã</span><select class="form-control" name="ward" id="ward-select" required disabled><option value="">Chọn tỉnh/thành trước</option></select></label>
              <label class="form-field"><span class="form-label">Nhãn địa chỉ</span><select class="form-control" name="labelChoice" id="address-label-select"><option>Nhà riêng</option><option>Công ty</option><option>Trường học</option><option value="OTHER">Khác</option></select></label>
              <label class="form-field is-hidden" id="custom-label-field"><span class="form-label">Nhãn tùy chỉnh</span><input class="form-control" name="labelCustom" maxlength="50" placeholder="Ví dụ: Nhà người thân"></label>
              <label class="form-field form-field--full"><span class="form-label">Địa chỉ chi tiết</span><input class="form-control" name="detailAddress" minlength="5" maxlength="255" required></label>
              <label class="filter-option form-field--full"><input type="checkbox" name="isDefault"> Đặt làm địa chỉ mặc định</label>
              <p class="form-message form-field--full" id="address-message"></p>
              <div class="button-row"><button class="button button--primary" type="submit">Lưu địa chỉ</button><button class="button button--ghost" type="reset">Làm mới</button></div>
            </form>
          </section>
        </div>
      </div>
    </section>
  `;
}

function showMessage(id, message, success = false) {
  const element = document.querySelector(id);
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("form-message--success", success);
}

function clearFieldErrors(form) {
  form.querySelectorAll(".field-error").forEach((item) => item.remove());
  form.querySelectorAll(".has-error").forEach((item) => {
    item.classList.remove("has-error");
    item.removeAttribute("aria-invalid");
    item.removeAttribute("aria-describedby");
  });
}

function showFieldError(form, name, message) {
  const control = form.elements[name];
  if (!control) return;
  clearFieldError(form, name);
  control.classList.add("has-error");
  control.setAttribute("aria-invalid", "true");
  const error = document.createElement("small");
  error.className = "field-error";
  error.id = `${form.id}-${name}-error`;
  error.setAttribute("role", "alert");
  error.textContent = message;
  control.setAttribute("aria-describedby", error.id);
  control.closest(".form-field")?.append(error);
}

function clearFieldError(form, name) {
  const control = form.elements[name];
  if (!control) return;
  control.classList.remove("has-error");
  control.removeAttribute("aria-invalid");
  control.removeAttribute("aria-describedby");
  control.closest(".form-field")?.querySelector(".field-error")?.remove();
}

function bindLiveValidation(form, rules) {
  if (!form) return;
  Object.entries(rules).forEach(([name, rule]) => {
    const control = form.elements[name];
    if (!control) return;
    const validate = (showWhenEmpty = false) => {
      const value = control.value || "";
      if (!value && !showWhenEmpty) {
        clearFieldError(form, name);
        return;
      }
      const message = rule(value);
      if (message) showFieldError(form, name, message);
      else clearFieldError(form, name);
    };
    control.addEventListener("input", () => validate(false));
    control.addEventListener("change", () => validate(true));
    control.addEventListener("blur", () => validate(true));
  });
}

function validateFields(form, rules) {
  clearFieldErrors(form);
  let valid = true;
  Object.entries(rules).forEach(([name, rule]) => {
    const value = form.elements[name]?.value || "";
    const message = rule(value);
    if (message) {
      showFieldError(form, name, message);
      valid = false;
    }
  });
  return valid;
}

async function loadWards(provinceSelect, wardSelect, selectedWard = "") {
  const option = provinceSelect.selectedOptions[0];
  const provinceCode = option?.dataset.code;
  wardSelect.disabled = true;
  wardSelect.innerHTML = '<option value="">Đang tải phường/xã...</option>';
  if (!provinceCode) {
    wardSelect.innerHTML = '<option value="">Chọn tỉnh/thành trước</option>';
    return;
  }
  const wards = await getWards(provinceCode);
  wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>' + wards
    .map((ward) => `<option value="${escapeHtml(ward.name)}" ${ward.name === selectedWard ? "selected" : ""}>${escapeHtml(ward.name)}</option>`)
    .join("");
  wardSelect.disabled = false;
}

async function initializeAddressSelectors() {
  const form = document.querySelector("#address-form");
  const provinceSelect = document.querySelector("#province-select");
  const wardSelect = document.querySelector("#ward-select");
  const labelSelect = document.querySelector("#address-label-select");
  if (!form || !provinceSelect || !wardSelect) return;

  labelSelect?.addEventListener("change", () => {
    const custom = labelSelect.value === "OTHER";
    document.querySelector("#custom-label-field")?.classList.toggle("is-hidden", !custom);
    form.elements.labelCustom.required = custom;
  });

  try {
    const provinces = await getProvinces();
    provinceSelect.innerHTML = '<option value="">Chọn tỉnh/thành phố</option>' + provinces
      .map((province) => `<option value="${escapeHtml(province.name)}" data-code="${province.code}">${escapeHtml(province.name)}</option>`)
      .join("");
    provinceSelect.addEventListener("change", () => loadWards(provinceSelect, wardSelect).catch(() => {
      showMessage("#address-message", "Không thể tải phường/xã. Vui lòng thử lại.");
    }));
  } catch (error) {
    provinceSelect.outerHTML = '<input class="form-control" name="province" maxlength="100" placeholder="Nhập tỉnh/thành phố" required>';
    wardSelect.outerHTML = '<input class="form-control" name="ward" maxlength="100" placeholder="Nhập phường/xã" required>';
    showMessage("#address-message", "API địa chỉ tạm thời không khả dụng; bạn có thể nhập địa chỉ thủ công.");
  }
}

function setResetStep(form, step) {
  if (!form) return;
  form.dataset.resetStep = step;
  document.querySelectorAll("[data-reset-panel]").forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.resetPanel !== step);
  });
  document.querySelectorAll("[data-reset-step-label]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.resetStepLabel === step);
  });
}

function resetForgotPasswordFlow(form) {
  if (!form) return;
  form.reset();
  form.elements.token.value = "";
  document.querySelector("#reset-demo-code").textContent = "------";
  clearFieldErrors(form);
  showMessage("#auth-message", "");
  setResetStep(form, "request");
}
export function mountAccountPage(render) {
  initializeAddressSelectors();
  const nameRule = (value) => isValidName(value)
    ? ""
    : "Nhập họ tên tối thiểu 2 từ, không chứa số/ký tự lạ.";
  const emailRule = (value) => isValidEmail(value)
    ? ""
    : "Email chưa đúng. Ví dụ: ten@gmail.com hoặc ten@st.uel.edu.vn.";
  const loginIdentifierRule = (value) => {
    const text = String(value || "").trim();
    if (text.includes("@")) return emailRule(text);
    return isValidPhone(text) ? "" : "Nhập email hợp lệ hoặc SĐT 10 số bắt đầu 03/05/07/08/09.";
  };
  const phoneRule = (value) => isValidPhone(value)
    ? ""
    : "SĐT gồm 10 số, bắt đầu 03/05/07/08/09, không dùng số giả.";
  const birthRule = (value) => isValidDateOfBirth(value)
    ? ""
    : "Ngày sinh chưa hợp lệ. Khách hàng cần từ 13 tuổi trở lên.";
  const passwordRule = (value) => value.length >= 8 ? "" : "Mật khẩu phải có ít nhất 8 ký tự.";
  const detailAddressRule = (value) => value.trim().length >= 5 ? "" : "Địa chỉ chi tiết phải có ít nhất 5 ký tự.";
  bindLiveValidation(document.querySelector("#login-form"), { identifier: loginIdentifierRule });
  bindLiveValidation(document.querySelector("#register-form"), { fullName: nameRule, email: emailRule, phone: phoneRule, dateOfBirth: birthRule, password: passwordRule });
  bindLiveValidation(document.querySelector("#forgot-form"), { identifier: loginIdentifierRule, code: (value) => /^\d{6}$/.test(String(value || "").trim()) ? "" : "Mã xác thực gồm 6 chữ số.", password: passwordRule, confirmPassword: passwordRule });
  bindLiveValidation(document.querySelector("#profile-form"), { fullName: nameRule, email: emailRule, phone: phoneRule, dateOfBirth: birthRule });
  bindLiveValidation(document.querySelector("#address-form"), {
    receiverName: nameRule,
    receiverPhone: phoneRule,
    province: (value) => value ? "" : "Vui lòng chọn tỉnh/thành phố.",
    ward: (value) => value ? "" : "Vui lòng chọn phường/xã.",
    detailAddress: detailAddressRule
  });
  document.querySelectorAll('[data-action="toggle-password"]').forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.closest(".password-input-wrap")?.querySelector("input");
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.setAttribute("aria-pressed", String(!visible));
      button.setAttribute("aria-label", visible ? "Hiện mật khẩu" : "Ẩn mật khẩu");
      button.querySelector("[data-password-eye]")?.classList.toggle("is-hidden", !visible);
      button.querySelector("[data-password-eye-off]")?.classList.toggle("is-hidden", visible);
    });
  });
  document.querySelectorAll("[data-account-target]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("#" + button.dataset.accountTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelector("#login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateFields(form, { identifier: loginIdentifierRule })) return;
    const data = new FormData(form);
    try {
      loginCustomer(data.get("identifier"), data.get("password"));
      const redirect = new URLSearchParams(location.search).get("redirect");
      redirectTo(redirect || ROUTES.account);
    } catch (error) {
      showMessage("#auth-message", error.message);
    }
  });

  document.querySelector("#register-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateFields(form, {
      fullName: nameRule,
      email: emailRule,
      phone: phoneRule,
      dateOfBirth: birthRule,
      password: passwordRule
    })) return;
    const data = Object.fromEntries(new FormData(form));
    try {
      registerCustomer(data);
      redirectTo(ROUTES.account);
    } catch (error) {
      showMessage("#auth-message", error.message);
    }
  });

  document.querySelector('[data-action="reset-password-restart"]')?.addEventListener("click", () => {
    resetForgotPasswordFlow(document.querySelector("#forgot-form"));
  });

  document.querySelector("#forgot-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const step = form.dataset.resetStep || "request";
    try {
      if (step === "request") {
        if (!validateFields(form, { identifier: loginIdentifierRule })) return;
        const result = requestPasswordReset(form.elements.identifier.value);
        form.elements.token.value = result.token;
        document.querySelector("#reset-demo-code").textContent = result.code;
        showMessage("#auth-message", result.message, true);
        setResetStep(form, "verify");
        form.elements.code.focus();
        return;
      }

      if (step === "verify") {
        if (!validateFields(form, { code: (value) => /^\d{6}$/.test(String(value || "").trim()) ? "" : "Mã xác thực gồm 6 chữ số." })) return;
        verifyPasswordReset(form.elements.token.value, form.elements.code.value);
        showMessage("#auth-message", "Mã hợp lệ. Vui lòng tạo mật khẩu mới.", true);
        setResetStep(form, "complete");
        form.elements.password.focus();
        return;
      }

      if (!validateFields(form, { password: passwordRule, confirmPassword: passwordRule })) return;
      const message = completePasswordReset({
        token: form.elements.token.value,
        code: form.elements.code.value,
        password: form.elements.password.value,
        confirmPassword: form.elements.confirmPassword.value
      });
      showMessage("#auth-message", message, true);
      window.setTimeout(() => redirectTo(ROUTES.login), 1200);
    } catch (error) {
      showMessage("#auth-message", error.message);
    }
  });

  document.querySelector("#profile-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateFields(form, {
      fullName: nameRule,
      email: emailRule,
      phone: phoneRule,
      dateOfBirth: birthRule
    })) return;
    const data = Object.fromEntries(new FormData(form));
    try {
      updateProfile(data);
      showMessage("#profile-message", "Đã cập nhật hồ sơ.", true);
    } catch (error) {
      showMessage("#profile-message", error.message);
    }
  });

  document.querySelector("#address-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (!validateFields(form, {
      receiverName: nameRule,
      receiverPhone: phoneRule,
      province: (value) => value ? "" : "Vui lòng chọn tỉnh/thành phố.",
      ward: (value) => value ? "" : "Vui lòng chọn phường/xã.",
      detailAddress: detailAddressRule
    })) return;
    if (data.labelChoice === "OTHER" && data.labelCustom.trim().length < 2) {
      showFieldError(form, "labelCustom", "Vui lòng nhập nhãn địa chỉ.");
      return;
    }
    data.label = data.labelChoice === "OTHER" ? data.labelCustom.trim() : data.labelChoice;
    data.isDefault = form.elements.isDefault.checked;
    try {
      saveAddress(data);
      render();
    } catch (error) {
      showMessage("#address-message", error.message);
    }
  });

  document.querySelectorAll('[data-action="edit-address"]').forEach((button) => {
    button.addEventListener("click", async () => {
      const address = getUserAddresses().find((item) => item.id === Number(button.dataset.addressId));
      const form = document.querySelector("#address-form");
      if (!address || !form) return;
      for (const key of ["id", "receiverName", "receiverPhone", "district", "detailAddress"]) {
        form.elements[key].value = address[key] || "";
      }
      const provinceSelect = form.elements.province;
      provinceSelect.value = address.province || "";
      if (provinceSelect.tagName === "SELECT") await loadWards(provinceSelect, form.elements.ward, address.ward);
      else form.elements.ward.value = address.ward || "";
      const standardLabels = ["Nhà riêng", "Công ty", "Trường học"];
      form.elements.labelChoice.value = standardLabels.includes(address.label) ? address.label : "OTHER";
      form.elements.labelCustom.value = standardLabels.includes(address.label) ? "" : address.label;
      document.querySelector("#custom-label-field")?.classList.toggle("is-hidden", standardLabels.includes(address.label));
      form.elements.isDefault.checked = address.isDefault;
      document.querySelector("#address-form-title").textContent = "Sửa địa chỉ";
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  document.querySelectorAll('[data-action="default-address"]').forEach((button) => {
    button.addEventListener("click", () => {
      setDefaultAddress(button.dataset.addressId);
      render();
    });
  });

  document.querySelectorAll('[data-action="delete-address"]').forEach((button) => {
    button.addEventListener("click", () => {
      deleteAddress(button.dataset.addressId);
      render();
    });
  });
}

export function handleAccountGlobalAction(action) {
  if (action === "logout-customer") {
    logoutCustomer();
    redirectTo(ROUTES.home);
    return true;
  }
  return false;
}













