const API_BASE_URL = "https://provinces.open-api.vn/api/v2";

let provinceCache = null;
const wardCache = new Map();

async function request(path) {
  const response = await fetch(API_BASE_URL + path, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Không thể tải dữ liệu địa chỉ. Vui lòng thử lại.");
  return response.json();
}

export async function getProvinces() {
  if (!provinceCache) provinceCache = await request("/p/");
  return provinceCache;
}

export async function getWards(provinceCode) {
  const key = String(provinceCode || "");
  if (!key) return [];
  if (!wardCache.has(key)) wardCache.set(key, await request(`/w/?province=${encodeURIComponent(key)}`));
  return wardCache.get(key);
}

export function clearAddressCache() {
  provinceCache = null;
  wardCache.clear();
}
