# PWA Tủ Đồ Trang Phục & Gợi Ý Phối Đồ

Tài liệu này mô tả yêu cầu sản phẩm (PRD) + định hướng kỹ thuật để **Antigravity** có thể xây dựng một website **PWA** cho phép người dùng quản lý tủ đồ cá nhân và nhận **gợi ý combo trang phục** thông minh dựa trên **Gemini**, thời tiết và mục đích sử dụng.

---

## 1. Mục tiêu sản phẩm

* Giúp người dùng:

  * Quản lý toàn bộ trang phục cá nhân
  * Biết hôm nay nên mặc gì phù hợp thời tiết & hoàn cảnh
  * Lưu lại lịch sử mặc đồ theo ngày & mục đích
* Website hoạt động tốt như **mobile app (PWA)**
* Cá nhân hoá dữ liệu theo **số điện thoại** (không chia sẻ giữa các user)

---

## 2. Đối tượng người dùng

* Người trẻ, đi làm, sinh viên
* Quan tâm đến thời trang nhưng không muốn mất thời gian suy nghĩ phối đồ
* Sử dụng chủ yếu trên điện thoại

---

## 3. Tổng quan Flow sử dụng

1. User truy cập website
2. Nhập **số điện thoại** → đăng nhập / tạo user
3. Vào **Home**
4. Chọn 1 trong các chức năng:

   * Nhận đề xuất trang phục
   * Quản lý tủ đồ
   * Xem lịch sử mặc đồ

---

## 4. Chức năng chi tiết

### 4.1 Đăng nhập bằng số điện thoại

* Input: số điện thoại
* OTP (có thể mock ở giai đoạn đầu)
* Mỗi số điện thoại = 1 user riêng biệt
* Không cần password

**Data:**

* phone_number (unique)
* created_at

---

### 4.2 Màn hình Home

Các nút chức năng chính:

1. 🎽 Nhận đề xuất trang phục
2. 👕 Quản lý trang phục
3. 📅 Lịch sử mặc đồ

Hiển thị thêm:

* Thời tiết hiện tại
* Nhiệt độ
* Gợi ý nhanh (optional)

---

### 4.3 Quản lý trang phục (Core feature)

#### 4.3.1 Model Trang Phục (Clothing Item)

| Field      | Kiểu     | Mô tả                                   |
| ---------- | -------- | --------------------------------------- |
| id         | UUID     | định danh                               |
| user_id    | UUID     | liên kết user                           |
| name       | string   | tên gợi nhớ                             |
| type       | enum     | áo thun, sơ mi, jeans, váy, áo khoác... |
| style      | string   | form rộng, slim fit, oversize...        |
| color      | string   | màu sắc                                 |
| material   | string   | cotton, jean, len, lụa...               |
| season     | enum[]   | xuân, hạ, thu, đông, quanh năm          |
| image_url  | string   | ảnh trang phục                          |
| created_at | datetime |                                         |
| updated_at | datetime |                                         |

---

#### 4.3.2 Danh sách trang phục

* Hiển thị dạng grid/list
* **Pagination**
* **Filter**:

  * Theo loại
  * Theo màu sắc
  * Theo mùa
  * Theo chất liệu
* **Search** theo tên

---

#### 4.3.3 Thao tác CRUD

* ➕ Thêm trang phục
* ✏️ Sửa trang phục
* 🗑 Xoá trang phục
* Upload ảnh (camera hoặc gallery)

---

### 4.4 Nhận đề xuất combo trang phục (AI)

#### 4.4.1 Input từ user

* Mục đích mặc:

  * Đi làm
  * Đi chơi
  * Ăn cưới
  * Dự tiệc
  * Đi du lịch
  * Khác (free text)

* Ngày sử dụng (default: hôm nay)

---

#### 4.4.2 Context hệ thống cung cấp cho Gemini

* Danh sách trang phục của user
* Thời tiết hiện tại (API thời tiết):

  * Nhiệt độ
  * Trạng thái: mưa, nắng, lạnh, nóng
* Mùa trong năm
* Mục đích mặc

---

#### 4.4.3 Prompt mẫu cho Gemini

```text
Bạn là stylist cá nhân.

Danh sách trang phục của user:
{{CLOTHING_LIST}}

Thông tin ngữ cảnh:
- Nhiệt độ: {{TEMPERATURE}}°C
- Thời tiết: {{WEATHER}}
- Mùa: {{SEASON}}
- Mục đích: {{PURPOSE}}

Yêu cầu:
- Đề xuất 1–2 combo trang phục phù hợp
- Giải thích ngắn gọn lý do chọn
- Trả về dạng JSON
```

---

#### 4.4.4 Output mong muốn

```json
{
  "combos": [
    {
      "items": ["Áo sơ mi trắng", "Quần jeans xanh", "Giày da nâu"],
      "reason": "Phù hợp dự tiệc, lịch sự, nhiệt độ mát"
    }
  ]
}
```

---

#### 4.4.5 Lưu lịch sử sau khi user chọn combo

* User xác nhận combo đã mặc
* Lưu vào lịch sử

---

### 4.5 Lịch sử mặc đồ

#### 4.5.1 Model History

| Field      | Kiểu     |
| ---------- | -------- |
| id         | UUID     |
| user_id    | UUID     |
| date       | date     |
| purpose    | string   |
| combo      | json     |
| weather    | json     |
| created_at | datetime |

---

#### 4.5.2 UI Lịch sử

* List theo timeline
* Filter:

  * Theo khoảng thời gian (from – to)
  * Theo mục đích

---

## 5. PWA Requirements

* Installable (Add to Home Screen)
* Offline support:

  * Xem trang phục đã load
* Responsive (mobile-first)
* Push Notification (future):

  * Nhắc mặc đồ

---

## 6. Technical Requirements & Tech Stack

### 6.1 Frontend (UI)

**Framework**

* Next.js (>= 14)
* Sử dụng **App Router** (`/app` directory)

**Rendering & Data Fetching**

* Ưu tiên **Server Components** cho:

  * Trang list trang phục
  * Trang lịch sử
  * Trang home
* **Client Components** chỉ dùng khi cần:

  * Form input
  * Upload ảnh
  * Filter interactive

**Server Actions**

* Toàn bộ CRUD chính sử dụng **Next.js Server Actions**

  * Thêm / sửa / xoá trang phục
  * Lưu lịch sử mặc đồ
  * Gọi Gemini API (qua backend)
* Không expose API route trừ khi cần external access

**Styling**

* TailwindCSS
* shadcn/ui cho:

  * Button
  * Dialog / Modal
  * Form
  * Select / Dropdown
  * Pagination

**Form Handling**

* React Hook Form + Zod
* Validation ở cả client và server

**State Management**

* Ưu tiên server state
* Client state tối thiểu (useState, useTransition)

---

### 6.2 Backend Logic (Next.js)

* Backend nằm chung trong Next.js (Fullstack)
* Không tách service riêng cho MVP

**Auth**

* Login bằng số điện thoại
* Token-based session (JWT hoặc encrypted cookie)
* Middleware bảo vệ route theo user

**Folder gợi ý**

```
/app
  /(auth)
  /(dashboard)
  /actions
  /components
  /lib
```

---

### 6.3 Database

**Database**

* PostgreSQL
* Provider: **Turso**

**ORM**

* Drizzle ORM (khuyến nghị) hoặc Prisma

**Connection**

* Sử dụng connection pooling phù hợp với serverless
* Env vars quản lý connection string

---

### 6.4 AI Integration (Gemini)

* Gọi Gemini thông qua **Server Actions**
* Không gọi trực tiếp từ client
* Có layer chuẩn hoá prompt & output

**Error Handling**

* Fallback logic nếu Gemini lỗi:

  * Gợi ý combo ngẫu nhiên nhưng hợp mùa

---

### 6.5 External Services

* Weather API (OpenWeather hoặc tương đương)
* Image storage (Cloudinary / S3 compatible)

---

## 7. Phân quyền & bảo mật

* Mỗi user chỉ truy cập data của mình
* Auth dựa trên phone_number + token

---

## 8. MVP Scope

**Phase 1**

* Login bằng số điện thoại
* CRUD trang phục
* Gợi ý combo bằng Gemini
* Lịch sử mặc đồ

**Phase 2**

* Push notification
* Học thói quen user
* Gợi ý theo phong cách cá nhân

---

## 9. Success Metrics

* Số user quay lại hằng tuần
* Số lần sử dụng tính năng gợi ý
* Tỷ lệ user lưu combo vào lịch sử

---

**End of document**
