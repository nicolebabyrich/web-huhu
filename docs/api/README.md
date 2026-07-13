# API địa chỉ hành chính

Frontend sử dụng Vietnam Provinces API phiên bản 2025 qua `frontend/src/services/addressService.js`.

- Tỉnh/thành: `GET /api/v2/p/`
- Phường/xã theo tỉnh: `GET /api/v2/w/?province={code}`
- `docs/api/openapi.json` là đặc tả OpenAPI dùng để đối chiếu endpoint, kiểu dữ liệu và khả năng tích hợp.

Hệ thống ưu tiên mô hình hai cấp tỉnh/thành và phường/xã. Quận/huyện là trường tùy chọn để tương thích dữ liệu địa chỉ cũ.
