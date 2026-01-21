# 👗 Daily Beauty Clothes

> **Ứng dụng PWA quản lý tủ đồ & gợi ý phối đồ bằng AI**

Ứng dụng giúp bạn quản lý tủ quần áo cá nhân và nhận gợi ý phối đồ thông minh dựa trên thời tiết và mục đích sử dụng.

## ✨ Tính năng

- 🔐 **Đăng nhập nhanh** - Đăng nhập bằng số điện thoại
- 👕 **Quản lý tủ đồ** - Thêm, xem, xóa quần áo với hình ảnh
- 🤖 **Gợi ý AI** - Phối đồ thông minh với Google Gemini
- 🌤️ **Tích hợp thời tiết** - Gợi ý phù hợp với thời tiết hiện tại
- 📅 **Lịch sử** - Xem lại các bộ đồ đã mặc
- 📱 **PWA** - Cài đặt như ứng dụng native

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Turso (LibSQL) + Drizzle ORM |
| AI | Google Gemini API |
| Weather | WeatherAPI.com |
| Auth | JWT (jose) |

## 🚀 Bắt đầu

### 1. Clone và cài đặt

```bash
git clone https://github.com/JethroHawthorn/daily_beauty_clothes.git
cd daily_beauty_clothes
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ template:

```bash
cp env.example .env
```

Điền các API keys:

```env
TURSO_URL=libsql://your-database.turso.io
TURSO_TOKEN=your_turso_auth_token
GEMINI_API_KEY=your_google_gemini_key
WEATHER_API_KEY=your_weatherapi_key
```

### 3. Khởi tạo database

```bash
npx drizzle-kit push
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── (auth)/login/      # Trang đăng nhập
│   ├── (dashboard)/
│   │   ├── wardrobe/      # Quản lý tủ đồ
│   │   ├── suggest/       # Gợi ý phối đồ
│   │   └── history/       # Lịch sử
│   └── actions/           # Server Actions
├── components/ui/         # shadcn/ui components
├── db/schema.ts          # Database schema
└── lib/                  # Utilities
```

## 🔑 API Keys

| Service | Link đăng ký |
|---------|-------------|
| Turso | [turso.tech](https://turso.tech) |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) |
| WeatherAPI | [weatherapi.com](https://weatherapi.com) |

## 📝 License

MIT

---

Made with ❤️ using Next.js & AI
