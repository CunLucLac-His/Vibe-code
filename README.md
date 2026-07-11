# Hà Tiến Trung (CunZ) — Personal Portfolio & Showcase

Trang Portfolio cá nhân của **Hà Tiến Trung** (Solo Product Builder & AI Integrator), được thiết kế để gây ấn tượng mạnh mẽ cho nhà tuyển dụng và đối tác thông qua phong cách thẩm mỹ cao cấp (Liquid Glass/Glassmorphism), hình nền khói động huyền ảo (Ethereal Shadow) và lưới bố cục Bento hiện đại.

---

## 🚀 Tính năng nổi bật

1. **Hiệu ứng Khói Động Ethereal Shadow:** Sử dụng svg filter kết hợp Framer Motion để tạo lớp nền khói lỏng di động mềm mại, hòa hợp với giao diện tối huyền bí.
2. **Quầng sáng Spotlight di chuột:** Component `SpotlightCard` tự phát triển bắt tọa độ chuột để tạo nguồn sáng radial gradient chuyển động theo con trỏ chuột trên các thẻ dự án và kinh nghiệm.
3. **Bố cục Bento Grid Kinh nghiệm:** Thể hiện trực quan kỹ năng và kinh nghiệm (AI Integrator, DevOps/Cloud, Phân tích tài chính, Phát triển cộng đồng).
4. **Nhãn đo lường năng lực (Skill Level Badges):** Đánh giá mức độ thành thạo cho từng nhóm kỹ năng (Expert, Advanced, Evaluated).
5. **Thống kê hiệu suất (Stats Section):** Hàng số liệu trực quan ngay tại Hero để nhà tuyển dụng nhanh chóng đánh giá quy mô dự án và thâm niên.
6. **Form liên hệ đa kênh & Message Form:** Tích hợp form liên hệ nhanh có thông báo Toast thành công mượt mà, cùng hệ thống nút mạng xã hội (Email, GitHub, LinkedIn, Instagram).
7. **Tách biệt Dữ liệu và Hiển thị:** Toàn bộ nội dung portfolio được tổ chức lưu trữ độc lập tại `src/data/portfolio.ts` giúp bảo trì và cập nhật thông tin cực kỳ nhanh chóng.

---

## 🛠️ Công nghệ sử dụng

* **Core:** React 18 + TypeScript + Vite
* **Styling:** Tailwind CSS + Vanilla CSS (Liquid Glass effects)
* **Animation:** Framer Motion (Turbulence & Displacement SVG filters)
* **Icons:** Lucide React
* **Components:** Custom Shadcn UI primitives (Button, Input, Label, Tooltip, Switch, Textarea)

---

## 📂 Cấu trúc thư mục quan trọng

```text
src/
├── components/
│   └── ui/
│       ├── button.tsx            # Shadcn Button primitive
│       ├── input.tsx             # Shadcn Input primitive
│       ├── label.tsx             # Shadcn Label primitive
│       ├── tooltip.tsx           # Shadcn Tooltip primitive
│       ├── etheral-shadow.tsx    # Liquid shadow animation component
│       ├── particle-text-effect.tsx # Particle physics intro text
│       ├── reveal.tsx            # Scroll fade-in animation wrapper
│       ├── scroll-reveal-text.tsx # Text reveal on scroll
│       ├── words-pull-up.tsx     # Typography entry animations
│       └── demo.tsx              # Footer wrapper component
├── data/
│   └── portfolio.ts              # Data source for all projects, skills, metrics, and experiences
├── App.tsx                       # Main page layouts and state management
├── index.css                     # Global design tokens and glassmorphism styles
└── main.tsx                      # App entrypoint
```

---

## 💻 Chạy thử nghiệm Local

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```
2. **Khởi chạy dev server:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ khả dụng tại: `http://localhost:5173/`

3. **Biên dịch Production:**
   ```bash
   npm run build
   ```
