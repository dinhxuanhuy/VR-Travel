# VR Travel Redux 🌐

> A modern, high-performance 3D Gaussian Splatting viewer application built with React 19, TypeScript, and Vite 7.

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![React Router](https://img.shields.io/badge/React_Router-7.9.3-CA4245?style=for-the-badge&logo=reactrouter)

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

### 🏠 Trang Home

- **3D Model Viewer**:
  - Hiển thị mô hình 3D mặc định (Bonsai)
  - Hỗ trợ định dạng `.splat` và `.ply`
  - Upload từ local hoặc load từ URL
  - Preview real-time trong canvas

### 📚 Trang Library

- **Duyệt Thư Viện Mô Hình**:
  - Kết nối với Hugging Face dataset
  - Hiển thị danh sách mô hình theo danh mục
  - Sample Library: Mô hình mẫu có sẵn
  - User Library: Mô hình do người dùng tải lên
  - Xem trước mô hình 3D trực tiếp
  - Làm mới danh sách mô hình
  - Lọc file theo định dạng (.splat, .ply)

### 🔧 Trang Reconstruction

- **Tải Ảnh Lên**:
  - Drag-and-drop upload interface
  - Hỗ trợ nhiều file cùng lúc
  - Preview danh sách file với dung lượng
  - Xóa từng file hoặc xóa tất cả
  - Hỗ trợ định dạng: JPG, JPEG, PNG, WEBP
  - Sẵn sàng tích hợp API reconstruction

### 🖼️ Viewer Controls

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

## � Cài Đặt

### Yêu Cầu

- Node.js >= 18.0.0
- npm hoặc yarn
- Hugging Face API key (cho tính năng Library)

### Các Bước

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục
cd vr-travel-redux

# Cài đặt dependencies
npm install

# Tạo file .env và thêm API key
echo "VITE_HUGGING_FACE_API_KEY=your_api_key_here" > .env

# Chạy development server
npm run dev
```

### Lấy Hugging Face API Key

1. Đăng ký tài khoản tại [Hugging Face](https://huggingface.co/)
2. Vào [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Tạo token mới với quyền `read`
4. Copy token vào file `.env`

---

## 🎮 Sử Dụng

### Navigation

Ứng dụng có 3 trang chính:

- **Home** (`/`): Trang chủ với 3D viewer mặc định
- **Library** (`/library`): Duyệt và xem thư viện mô hình
- **Reconstruction** (`/reconstruction`): Tải ảnh lên để tái tạo 3D

### Trang Home

1. Xem mô hình 3D mặc định (Bonsai)
2. Upload model từ local:
   - Click nút **Upload** trên control panel
   - Chọn file `.splat` hoặc `.ply`
   - Mô hình sẽ được load tự động

### Trang Library

1. **Sample Library**: Xem các mô hình mẫu có sẵn
2. Click vào model để xem preview trong viewer
3. Click **Refresh** để cập nhật danh sách
4. **User Library**: Xem mô hình đã upload (cần đăng nhập)

### Trang Reconstruction

1. **Drag & Drop**: Kéo thả ảnh vào vùng upload
2. Hoặc click **Choose Files** để chọn ảnh
3. Xem danh sách file đã chọn
4. Click **X** để xóa từng file
5. Click **Clear All** để xóa tất cả
6. Click **Submit** để gửi (API integration pending)

### Viewer Controls

- **Orbit**: Click chuột trái + kéo
- **Zoom**: Scroll chuột
- **Pan**: Click chuột phải + kéo
- **Auto-rotate**: Toggle để xoay tự động
- **Fullscreen**: Click icon fullscreen để mở rộng

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

## � Cấu Trúc Thư Mục

```
vr-travel-redux/
├── public/              # Static assets
│   └── vite.svg
├── src/
│   ├── components/      # React components
│   │   ├── NavBar.tsx           # Navigation bar với routing
│   │   ├── GaussianViewer.tsx   # 3D viewer component
│   │   └── LibraryItem.tsx      # Library list component
│   ├── pages/           # Page components
│   │   ├── Home.tsx             # Trang chủ với viewer mặc định
│   │   ├── Library.tsx          # Trang thư viện mô hình
│   │   └── Reconstruction.tsx   # Trang tải ảnh lên
│   ├── context/         # Services và managers
│   │   └── HuggingFaceDatasetManager.ts  # HF API integration
│   ├── assets/          # Images, fonts, etc.
│   ├── App.tsx          # Main app với routing
│   ├── main.tsx         # Entry point với BrowserRouter
│   └── index.css        # Global styles
├── .env                 # Environment variables (API keys)
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind config
├── vite.config.ts       # Vite config
├── README.md            # Documentation
├── GUIDE.md             # Chi tiết về code
└── IMPLEMENTATION_SUMMARY.md  # Tóm tắt implementation
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
