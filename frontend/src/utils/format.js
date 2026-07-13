export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^\d{1,2}[./-]\d{1,2}[./-]\d{4}$/.test(raw)) {
    const [day, month, year] = raw.split(/[./-]/).map((part) => part.padStart(2, "0"));
    return `${day}/${month}/${year}`;
  }
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(raw)) {
    const [year, month, day] = raw.split("-");
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.replaceAll(".", "/");
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function maxBirthDateForAge(minAge = 13) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - minAge);
  return date.toISOString().slice(0, 10);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function statusLabel(status) {
  const labels = {
    ACTIVE: "Đang bán",
    OUT_OF_STOCK: "Hết hàng",
    HIDDEN: "Ẩn",
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    VISIBLE: "Đang hiển thị",
    DRAFT: "Bản nháp",
    PUBLISHED: "Đã xuất bản",
    NEW: "Mới",
    PROCESSING: "Đang xử lý",
    RESOLVED: "Đã xử lý"
  };
  return labels[status] || status;
}

export function orderCode() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = String(Date.now()).slice(-5);
  return "AN" + date + suffix;
}

export function isValidEmail(email) {
  const value = normalizeEmail(email);
  if (!value || value.length > 254 || value.includes("..")) return false;
  const pattern = /^[a-z0-9._+-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
  if (!pattern.test(value)) return false;
  const [localPart, domain] = value.split("@");
  if (!localPart || localPart.length > 64 || localPart.startsWith(".") || localPart.endsWith(".")) return false;
  if (!domain || domain.includes("..")) return false;
  if (domain.startsWith("gmail.")) return ["gmail.com", "gmail.com.vn"].includes(domain);
  const tld = domain.split(".").pop() || "";
  return /^[a-z]{2,6}$/i.test(tld);
}

export function isValidPhone(phone) {
  const value = String(phone || "").trim();
  if (!/^\d{10}$/.test(value)) return false;
  return /^0[35789][0-9]{8}$/.test(value) && !/^(\d)\1{9}$/.test(value);
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function normalizePhone(phone) {
  let value = String(phone || "").trim().replace(/[^0-9+]/g, "");
  if (value.startsWith("+84")) value = "0" + value.slice(3);
  else if (value.startsWith("84") && value.length === 11) value = "0" + value.slice(2);
  return value.replace(/\D/g, "");
}

export function normalizeName(name) {
  return String(name || "").trim().replace(/\s+/g, " ");
}

export function isValidName(name) {
  const value = normalizeName(name);
  const words = value.split(" ").filter(Boolean);
  return value.length >= 5
    && value.length <= 100
    && words.length >= 2
    && words.every((word) => /^[\p{L}]+(?:[.'-][\p{L}]+)*$/u.test(word));
}

export function isValidDateOfBirth(value, minAge = 13) {
  if (!value) return true;
  const date = new Date(value + "T00:00:00");
  const latestAllowed = new Date(maxBirthDateForAge(minAge) + "T23:59:59");
  return !Number.isNaN(date.getTime()) && date <= latestAllowed && date.getFullYear() >= 1900;
}



