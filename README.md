# VR Travel Redux 🌐

> A modern, high-performance 3D Gaussian Splatting viewer application built with React 19, TypeScript, and Vite 7.

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38bdf8?style=for-the-badge&logo=tailwindcss)

</div>

---

## 📖 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Công Nghệ](#️-công-nghệ)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt](#-cài-đặt)
- [Sử Dụng](#-sử-dụng)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Tối Ưu Hóa](#-tối-ưu-hóa)
- [Hướng Dẫn Chi Tiết](#-hướng-dẫn-chi-tiết)
- [Tài Liệu Tham Khảo](#-tài-liệu-tham-khảo)

---

## 🎯 Giới Thiệu

**VR Travel Redux** là một ứng dụng web hiện đại cho phép người dùng xem và tương tác với các mô hình 3D **Gaussian Splatting**. Ứng dụng được xây dựng với mục tiêu:

- ✨ **Hiệu suất cao**: Sử dụng WebGL và gsplat library cho rendering 60+ FPS
- 🎨 **Giao diện đẹp**: Modern UI với Tailwind CSS 4 và glassmorphism effect
- 🚀 **Trải nghiệm mượt mà**: Responsive design, smooth animations, và intuitive controls
- 📦 **Dễ sử dụng**: Upload files, auto-rotation, fullscreen mode

---

## ✨ Tính Năng

### 🖼️ Viewer Chính

- **Load 3D Models**:
  - Hỗ trợ định dạng `.splat` và `.ply`
  - Upload từ local hoặc load từ URL
  - Preview real-time trong canvas

- **Interactive Controls**:
  - 🔄 **Orbit**: Quay camera xung quanh model
  - 🔍 **Zoom**: Phóng to/thu nhỏ với mouse wheel
  - 🖱️ **Pan**: Di chuyển camera với right-click + drag
  
- **Auto-rotation**: Tự động xoay model 360° để quan sát

- **Fullscreen Mode**: Xem toàn màn hình để trải nghiệm tốt nhất

### 🎛️ UI/UX Features

- **Responsive NavBar**:
  - Sticky positioning với scroll effect
  - Glassmorphism backdrop blur
  - Smooth hover animations
  
- **Loading States**:
  - Animated spinner với progress
  - Error handling với retry option
  - Model info display

- **Optimized Layout**:
  - Viewer chiếm 85% màn hình
  - Compact controls và info cards
  - Mobile-friendly responsive design

---

## 🛠️ Công Nghệ

### Frontend Framework
- **React 19.1.1**: Latest React với cải thiện performance và hooks
- **TypeScript 5.9.3**: Type-safe development với strict mode
- **Vite 7.1.7**: Ultra-fast build tool với HMR

### Styling
- **Tailwind CSS 4.0.0**: Utility-first CSS framework
- **Custom CSS**: Scrollbar styling, SVG protection, smooth transitions

### 3D Graphics
- **gsplat 1.2.9**: 3D Gaussian Splatting rendering library
- **WebGL**: Hardware-accelerated graphics
- **OrbitControls**: Interactive camera controls

### Dev Tools
- **ESLint**: Code linting với React Hooks plugin
- **TypeScript ESLint**: TypeScript-specific linting rules

---

## 💻 Yêu Cầu Hệ Thống

### Phần mềm
- **Node.js**: >= 18.0.0 (khuyến nghị 20.x LTS)
- **npm**: >= 9.0.0 (hoặc yarn/pnpm)
- **Browser**: Chrome/Edge/Firefox (phiên bản mới nhất)

### Phần cứng
- **GPU**: Hỗ trợ WebGL 2.0
- **RAM**: >= 4GB (khuyến nghị 8GB+)
- **Disk Space**: >= 500MB

---

## 📥 Cài Đặt

### Bước 1: Clone Repository

```bash
git clone <your-repo-url>
cd vr-travel-redux
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install
```

Hoặc với yarn:

```bash
yarn install
```

### Bước 3: Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Bước 4: Build Production

```bash
npm run build
```

Build output: `dist/` folder

### Bước 5: Preview Production Build

```bash
npm run preview
```

---

## 🎮 Sử Dụng

### Upload Model

1. Click nút **"Upload"** ở control panel
2. Chọn file `.splat` hoặc `.ply` từ máy tính
3. Model sẽ tự động load và hiển thị

### Camera Controls

| Thao Tác | Mô Tả |
|----------|-------|
| **Left Click + Drag** | Quay camera (orbit) |
| **Right Click + Drag** | Di chuyển camera (pan) |
| **Mouse Wheel** | Zoom in/out |
| **Auto-rotate Button** | Bật/tắt tự động xoay |

### Fullscreen Mode

- Click icon **fullscreen** (⛶) để vào chế độ toàn màn hình
- Nhấn `ESC` hoặc click icon exit để thoát

---

## 📁 Cấu Trúc Thư Mục

```
vr-travel-redux/
├── public/                      # Static assets
│   └── vite.svg                # Vite logo
│
├── src/
│   ├── components/              # React components
│   │   ├── NavBar.tsx          # Navigation bar component
│   │   └── GaussianViewer.tsx  # 3D viewer component
│   │
│   ├── App.tsx                  # Main app component
│   ├── App.css                  # App-specific styles
│   ├── index.css                # Global styles
│   ├── main.tsx                 # Entry point
│   └── vite-env.d.ts           # Vite type declarations
│
├── eslint.config.js             # ESLint configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TS config
├── tsconfig.node.json           # Node-specific TS config
├── vite.config.ts               # Vite configuration
├── package.json                 # Dependencies & scripts
├── README.md                    # Tài liệu này
└── GUIDE.md                     # Hướng dẫn code chi tiết
```

---

## ⚡ Tối Ưu Hóa

### Performance

1. **WebGL Rendering**: Hardware-accelerated graphics
2. **React 19**: Automatic batching và concurrent features
3. **Vite HMR**: Instant hot module replacement
4. **Code Splitting**: Lazy loading cho production

### UI/UX

1. **SVG Protection**: `flex-shrink-0` để prevent expansion
2. **Compact Layout**: Viewer chiếm 85% screen
3. **Smooth Animations**: CSS transitions 200-300ms
4. **Glassmorphism**: Backdrop blur cho modern look

### Accessibility

1. **Keyboard Navigation**: Tab-friendly controls
2. **ARIA Labels**: Screen reader support
3. **Focus Indicators**: Visible focus states
4. **Responsive Design**: Mobile/tablet/desktop

---

## 📚 Hướng Dẫn Chi Tiết

Để hiểu sâu hơn về cách code được tổ chức, React Hooks, useState, useEffect, và các pattern được sử dụng, vui lòng đọc:

➡️ **[GUIDE.md](./GUIDE.md)** - Hướng dẫn code chi tiết với giải thích từng component

---

## 📖 Tài Liệu Tham Khảo

### Official Documentation
- [React 19 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### 3D Graphics
- [gsplat Library](https://github.com/dylanebert/gsplat.js)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [3D Gaussian Splatting Paper](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vite DevTools](https://vite.dev/guide/features.html#hot-module-replacement)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Created with ❤️ by **COLMAP_KLTN Team**

- 📧 Email: your-email@example.com
- 🌐 Website: your-website.com
- 💼 LinkedIn: your-linkedin

---

## 🙏 Acknowledgments

- **gsplat.js** - Awesome 3D Gaussian Splatting library
- **Hugging Face** - Default model hosting
- **Tailwind CSS** - Beautiful utility-first CSS
- **React Team** - Amazing framework

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with React 19 + Vite 7 + TypeScript + Tailwind CSS 4

</div>
