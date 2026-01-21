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

## 10. Đề xuất mở rộng & tối ưu sản phẩm (Product Enhancements)

Phần này tổng hợp các đề xuất về **UX, UI, AI và Product** nhằm nâng cao trải nghiệm người dùng, đặc biệt phù hợp với **đối tượng nữ (20–35 tuổi)**. Đây là các gợi ý để Antigravity triển khai ngay hoặc đưa vào roadmap.

---

## 10.1 Các tính năng nên triển khai sớm (High-impact, Low/Medium effort)

### 1. Quick Action: “Hôm nay mặc gì?” ☀️

* Nút CTA lớn tại trang Home
* Khi user bấm, hệ thống tự động:

  * Lấy thời tiết hôm nay
  * Xác định ngày thường / cuối tuần
  * Tránh lặp lại combo đã mặc gần đây
* Trả về 1 combo duy nhất (nhanh – không cần nhập form)

**Giá trị:**

* Giảm thao tác
* Tăng tần suất sử dụng hằng ngày

---

### 2. Gợi ý trang phục theo cảm xúc 💗

Ngoài mục đích mặc, cho user chọn thêm:

* Hôm nay bạn muốn cảm thấy thế nào?

  * Tự tin
  * Nữ tính
  * Thoải mái
  * Năng động
  * Dịu dàng

**Áp dụng cho AI:**

* Cảm xúc được đưa vào prompt Gemini
* AI ưu tiên combo phù hợp cảm xúc

**Giá trị:**

* Cá nhân hoá mạnh
* Tạo cảm giác app “hiểu người dùng”

---

### 3. Trang phục yêu thích ⭐

* Cho phép user đánh dấu ❤️ các món đồ
* AI ưu tiên sử dụng trong gợi ý

**Giá trị:**

* Dễ implement
* Cá nhân hoá rõ rệt

---

## 10.2 Lịch sử & Thống kê nhẹ nhàng

### 4. Lịch sử mặc đồ nâng cao 📅

* Ngoài filter thời gian, bổ sung:

  * Filter theo mục đích
  * Filter theo cảm xúc

---

### 5. Thống kê đơn giản (không dashboard) 📊

Hiển thị dạng card:

* Màu sắc bạn mặc nhiều nhất
* Loại trang phục hay dùng
* Mục đích mặc phổ biến trong tháng

**Lưu ý:**

* Không dùng chart phức tạp
* Icon + text là đủ

---

## 10.3 Notification & Habit Building

### 6. Nhắc nhở mặc đồ (PWA Notification) 🔔

* Ví dụ nội dung:

  * “Hôm nay trời mát, bạn muốn gợi ý phối đồ không?”
* Giới hạn:

  * 1 lần/ngày
  * Ngôn từ nhẹ nhàng, không spam

---

## 10.4 Định hướng UI/UX tổng thể

### Tone & Style

* Nữ tính, tươi sáng, không sến
* Phong cách lifestyle – editorial
* Ưu tiên cảm xúc hơn dữ liệu

### Nguyên tắc UI quan trọng

* Ít màu, dùng đúng chỗ
* Spacing & typography quan trọng hơn màu sắc
* Empty state thân thiện, khuyến khích hành động

---

## 10.5 Định hướng AI & Copywriting

### Nguyên tắc khi dùng AI

* Không phán xét người dùng
* Không dùng từ ngữ cứng nhắc
* Luôn có giải thích ngắn gọn, tích cực

**Ví dụ tốt:**

> “Combo này giúp bạn trông gọn gàng và thoải mái trong thời tiết hôm nay 💗”

---

## 11. Roadmap gợi ý

### Phase 1 (MVP + UX tốt)

* CRUD trang phục
* Gợi ý combo AI
* Quick Action “Hôm nay mặc gì?”
* Trang phục yêu thích

### Phase 2 (Cá nhân hoá sâu hơn)

* Gợi ý theo cảm xúc
* Thống kê nhẹ nhàng
* Notification

### Phase 3 (Lifestyle features)

* Phong cách cá nhân (Style Profile)
* Lưu outfit cho sự kiện tương lai
* Gợi ý mặc lại đồ lâu không dùng

---

**End of document**
