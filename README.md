# IELTS Mastery

Nền tảng luyện IELTS song ngữ (EN/VI) — mock test, luyện tập, tra cứu, theo dõi tiến độ.

## Chạy trên máy tính (local)

> **Lưu ý:** Link GitHub (`github.com/...`) chỉ là **mã nguồn**, không phải website chạy được.  
> Bạn cần clone về máy rồi chạy lệnh bên dưới.

```bash
# 1. Clone repo
git clone https://github.com/Bachhhhhhhhhhhhhh/ieltss.git
cd ieltss

# 2. Cài dependencies (BẮT BUỘC — lần đầu mất 1–3 phút)
npm install

# 3. Chạy dev server
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

### Lỗi thường gặp

| Lỗi | Cách sửa |
|-----|----------|
| `'vite' is not recognized` | Chưa chạy `npm install` |
| `npm install` lỗi | Cần Node.js 18+ — tải tại https://nodejs.org |
| Port 5173 bận | Đóng terminal cũ hoặc dùng port khác |
| Mở GitHub URL thấy code | Đó là repo, không phải app — dùng link **GitHub Pages** bên dưới |

## Xem online (không cần cài gì)

Sau khi bật GitHub Pages (xem mục Deploy), truy cập:

**https://bachhhhhhhhhhhhhh.github.io/ieltss/**

## Bật GitHub Pages (1 lần)

1. Vào https://github.com/Bachhhhhhhhhhhhhh/ieltss/settings/pages
2. **Build and deployment** → Source: **GitHub Actions**
3. Đợi workflow chạy xong (~2 phút) tại tab **Actions**
4. Mở link ở trên

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy local |
| `npm run build` | Build production |
| `npm run lint` | Kiểm tra code |
| `npm run preview` | Xem bản build |

## Tính năng

- 20 bài Mock Test IELTS đầy đủ 4 kỹ năng
- Luyện tập: từ vựng, ngữ pháp, drill theo skill
- Tra cứu thông minh: voice search, study deck, vocab quiz
- Dashboard tiến độ + song ngữ EN/VI

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion · Recharts