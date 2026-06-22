# Hướng dẫn bật website (1 phút)

Site đã được build sẵn. Bạn chỉ cần **đổi 1 cài đặt** trên GitHub:

## Bước 1 — Mở Settings Pages

https://github.com/Bachhhhhhhhhhhhhh/ieltss/settings/pages

## Bước 2 — Chọn nguồn deploy

Trong **Build and deployment**:

1. **Source** → chọn **Deploy from a branch**
2. **Branch** → chọn **`gh-pages`**
3. **Folder** → chọn **`/ (root)`**
4. Bấm **Save**

## Bước 3 — Đợi 1–2 phút, mở link

**https://bachhhhhhhhhhhhhh.github.io/ieltss/**

---

## Cách khác (Netlify — không cần mật khẩu sau khi claim)

1. Mở: https://app.netlify.com/signup (đăng ký miễn phí bằng GitHub)
2. **Add new site** → **Import an existing project** → chọn repo **ieltss**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy → có link dạng `https://xxx.netlify.app` (không cần password)

---

## Chạy trên máy

```powershell
cd C:\Users\user\ielts-mastery
npm install
npm run dev
```

Mở http://localhost:5173