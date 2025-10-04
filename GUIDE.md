# VR Travel Redux - Hướng Dẫn Code Chi Tiết 📘

> Tài liệu này giải thích chi tiết về cách code được tổ chức, React Hooks, state management, và các pattern được sử dụng trong dự án.

# VR Travel Redux - Hướng Dẫn Code Chi Tiết 📘

> Tài liệu này giải thích chi tiết về cách code được tổ chức, React Hooks, state management, và các pattern được sử dụng trong dự án.

---

## 📑 Mục Lục

1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Entry Point & Main App](#2-entry-point--main-app)
3. [NavBar Component](#3-navbar-component)
4. [GaussianViewer Component](#4-gaussianviewer-component)
5. [React Hooks Chi Tiết](#5-react-hooks-chi-tiết)
6. [State Management](#6-state-management)
7. [TypeScript Patterns](#7-typescript-patterns)
8. [Styling với Tailwind CSS](#8-styling-với-tailwind-css)
9. [Performance Optimization](#9-performance-optimization)
10. [Best Practices](#10-best-practices)

---

## 1. Tổng Quan Kiến Trúc

### 1.1 Component Hierarchy

```
App (Root Component)
├── NavBar (Sticky Navigation)
│   ├── Logo Section
│   ├── Brand Name
│   └── Action Buttons (Home, Info, Settings)
│
└── Main Content
    ├── Hero Section (Title + Description)
    ├── GaussianViewer (3D Viewer)
    │   ├── Canvas (WebGL Rendering)
    │   ├── Status Overlay (Loading/Error)
    │   ├── Control Panel
    │   │   ├── Upload Button
    │   │   ├── Auto-rotate Toggle
    │   │   └── Fullscreen Button
    │   └── Model Info Display
    │
    └── Info Cards (3 feature cards)
```

### 1.2 Data Flow

```
User Interaction
      ↓
State Update (useState)
      ↓
Component Re-render
      ↓
useEffect Triggers
      ↓
Side Effects (API calls, DOM updates)
      ↓
UI Updates
```

### 1.3 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19 | Component-based UI |
| **Language** | TypeScript | Type safety |
| **Build Tool** | Vite 7 | Fast dev server & build |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **3D Graphics** | gsplat + WebGL | Gaussian Splatting |

---

## 2. Entry Point & Main App

### 2.1 main.tsx - Entry Point

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Giải thích:**

1. **StrictMode**: 
   - React component wrapper giúp phát hiện vấn đề trong development
   - Kích hoạt warnings về unsafe lifecycles, deprecated APIs
   - Không ảnh hưởng production build

2. **createRoot**:
   - React 18+ API để render root component
   - Thay thế `ReactDOM.render()` cũ
   - Hỗ trợ concurrent features

3. **document.getElementById('root')!**:
   - `!` là TypeScript non-null assertion operator
   - Báo compiler rằng element này chắc chắn tồn tại
   - Root element được định nghĩa trong `index.html`

### 2.2 App.tsx - Main Component

```tsx
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      <NavBar />
      
      <main className="container mx-auto px-4 py-4">
        {/* Hero Section */}
        <div className="text-center mb-4">
          <h1>3D Gaussian Splatting Viewer</h1>
          <p>Upload your models or explore the default scene</p>
        </div>

        {/* Viewer */}
        <GaussianViewer 
          defaultModelUrl="https://huggingface.co/.../bonsai-7k-mini.splat"
        />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {/* 3 info cards */}
        </div>
      </main>
    </div>
  );
}
```

**Giải thích Structure:**

1. **Container Layout**:
   ```tsx
   <div className="min-h-screen bg-gradient-to-b ...">
   ```
   - `min-h-screen`: Chiều cao tối thiểu = viewport height
   - `bg-gradient-to-b`: Gradient từ trên xuống dưới
   - Background tối cho 3D viewer

2. **Responsive Grid**:
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-3 ...">
   ```
   - Mobile: 1 column
   - Desktop (md breakpoint): 3 columns
   - Responsive design pattern

3. **Component Composition**:
   - Mỗi component độc lập, có thể reuse
   - Props drilling cho configuration
   - Clear separation of concerns

---

## 3. NavBar Component

### 3.1 Component Structure

```tsx
export const NavBar = () => {
  // State
  const [scrolled, setScrolled] = useState(false);

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.body.style.paddingTop = '64px';

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.paddingTop = '0';
    };
  }, [scrolled]);

  return (
    <nav className={`... ${scrolled ? 'scrolled-class' : 'default-class'}`}>
      {/* NavBar content */}
    </nav>
  );
};
```

### 3.2 useState Hook

**Syntax:**
```tsx
const [scrolled, setScrolled] = useState(false);
```

**Giải thích:**

1. **Destructuring Assignment**:
   - `scrolled`: State variable (giá trị hiện tại)
   - `setScrolled`: Setter function (để update state)
   - `useState(false)`: Initial value = false

2. **State Update**:
   ```tsx
   setScrolled(true);  // Update state
   ```
   - Khi gọi setter, React sẽ:
     1. Schedule re-render
     2. Update state value
     3. Re-run component function
     4. Update DOM

3. **Why Use State?**:
   - Trigger re-render khi value thay đổi
   - React tracks state changes
   - Declarative UI updates

### 3.3 useEffect Hook - Scroll Listener

```tsx
useEffect(() => {
  // 1. Effect function (chạy sau render)
  const handleScroll = () => {
    const isScrolled = window.scrollY > 20;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  };

  // 2. Setup: Add event listener
  window.addEventListener('scroll', handleScroll);
  document.body.style.paddingTop = '64px';

  // 3. Cleanup function (chạy khi component unmount hoặc dependencies thay đổi)
  return () => {
    window.removeEventListener('scroll', handleScroll);
    document.body.style.paddingTop = '0';
  };
}, [scrolled]); // 4. Dependencies array
```

**Giải thích Chi Tiết:**

1. **Effect Function**:
   - Chạy **sau** mỗi lần render
   - Không block painting (non-blocking)
   - Dùng cho side effects (API calls, subscriptions, DOM manipulation)

2. **Event Listener**:
   ```tsx
   window.addEventListener('scroll', handleScroll);
   ```
   - Lắng nghe scroll event trên window
   - `window.scrollY`: Số pixel đã scroll theo chiều dọc
   - Khi scroll > 20px → Change navbar style

3. **Cleanup Function**:
   ```tsx
   return () => {
     window.removeEventListener('scroll', handleScroll);
     document.body.style.paddingTop = '0';
   };
   ```
   - **Critical**: Prevent memory leaks
   - Remove listener khi component unmount
   - Reset body padding

4. **Dependencies Array `[scrolled]`**:
   - Effect chạy lại khi `scrolled` thay đổi
   - Empty array `[]`: Chỉ chạy 1 lần (mount)
   - No array: Chạy mỗi render (usually not wanted)

### 3.4 Conditional Styling

```tsx
<nav className={`
  fixed top-0 left-0 right-0 z-50 
  transition-all duration-300
  ${scrolled 
    ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl' 
    : 'bg-gray-900/90 backdrop-blur-sm'
  }
`}>
```

**Giải thích:**

1. **Template Literals**:
   - Backticks `` ` `` cho multi-line strings
   - Embedded expressions `${...}`

2. **Ternary Operator**:
   ```tsx
   scrolled ? 'class-if-true' : 'class-if-false'
   ```
   - Conditional rendering based on state
   - Clean inline conditions

3. **Tailwind Classes**:
   - `fixed`: Fixed positioning
   - `z-50`: Stack order (trên top)
   - `transition-all`: Smooth transitions
   - `backdrop-blur-md`: Glassmorphism effect

---

## 4. GaussianViewer Component

### 4.1 Component Overview

```tsx
export const GaussianViewer = ({ 
  defaultModelUrl,
  className 
}: GaussianViewerProps) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef(new SPLAT.Scene());
  const cameraRef = useRef(new SPLAT.Camera());
  const rendererRef = useRef<SPLAT.WebGLRenderer | null>(null);
  const controlsRef = useRef<any>(null);

  // State
  const [status, setStatus] = useState<ViewerStatus>('idle');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [modelInfo, setModelInfo] = useState<string>('');

  // Effects
  useEffect(() => { /* Initialize renderer */ }, [autoRotate]);
  useEffect(() => { /* Load model */ }, [currentFile, defaultModelUrl]);
  useEffect(() => { /* Fullscreen listener */ }, []);

  // Event handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => { ... };
  const toggleFullscreen = () => { ... };

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
      {/* UI overlays */}
    </div>
  );
};
```

### 4.2 useRef Hook

**Syntax:**
```tsx
const canvasRef = useRef<HTMLCanvasElement>(null);
```

**Giải thích:**

1. **Purpose**:
   - Store mutable values không trigger re-render
   - Access DOM elements directly
   - Persist values across renders

2. **DOM Reference**:
   ```tsx
   <canvas ref={canvasRef} />
   ```
   - `canvasRef.current` → HTMLCanvasElement
   - Access after component mounts

3. **Object Reference**:
   ```tsx
   const sceneRef = useRef(new SPLAT.Scene());
   ```
   - Store 3D scene object
   - Không tạo mới mỗi render
   - Persist throughout component lifecycle

4. **Difference vs useState**:
   | Feature | useState | useRef |
   |---------|----------|--------|
   | Re-render | ✅ Triggers | ❌ No trigger |
   | Persistence | ✅ Persists | ✅ Persists |
   | Use Case | UI state | DOM refs, mutable values |

### 4.3 TypeScript Generics

```tsx
const canvasRef = useRef<HTMLCanvasElement>(null);
//                       ^^^^^^^^^^^^^^^^^
//                       Type parameter
```

**Giải thích:**

1. **Generic Type**:
   - `<T>`: Type parameter
   - Specify exact type cho ref

2. **Type Safety**:
   ```tsx
   canvasRef.current?.getContext('2d'); // ✅ Type-safe
   canvasRef.current?.someRandomMethod(); // ❌ Compile error
   ```

3. **Null Safety**:
   - `null`: Initial value
   - `?.`: Optional chaining (safe access)

### 4.4 useEffect - Initialize Renderer

```tsx
useEffect(() => {
  if (!canvasRef.current) return;

  try {
    // 1. Create renderer
    rendererRef.current = new SPLAT.WebGLRenderer(canvasRef.current);
    
    // 2. Create controls
    controlsRef.current = new SPLAT.OrbitControls(
      cameraRef.current,
      rendererRef.current.canvas
    );

    // 3. Animation loop
    const animate = () => {
      if (controlsRef.current && rendererRef.current) {
        if (autoRotate) {
          controlsRef.current.azimuthAngle += 0.005;
        }
        controlsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      requestAnimationFrame(animate);
    };

    const animationFrameId = requestAnimationFrame(animate);

    // 4. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
    };
  } catch (error) {
    console.error('Failed to initialize renderer:', error);
    setStatus('error');
  }
}, [autoRotate]); // Re-run when autoRotate changes
```

**Giải thích Chi Tiết:**

1. **Early Return Pattern**:
   ```tsx
   if (!canvasRef.current) return;
   ```
   - Guard clause: Exit nếu canvas chưa mount
   - Prevent errors

2. **WebGL Renderer**:
   ```tsx
   rendererRef.current = new SPLAT.WebGLRenderer(canvasRef.current);
   ```
   - Tạo WebGL context
   - Hardware-accelerated rendering
   - Store trong ref (không trigger re-render)

3. **Animation Loop**:
   ```tsx
   const animate = () => {
     // Update camera
     controlsRef.current.update();
     // Render scene
     rendererRef.current.render(scene, camera);
     // Request next frame
     requestAnimationFrame(animate);
   };
   ```
   - **requestAnimationFrame**: Browser API
   - Optimized for 60 FPS
   - Pauses when tab inactive (performance)

4. **Auto-rotation**:
   ```tsx
   if (autoRotate) {
     controlsRef.current.azimuthAngle += 0.005;
   }
   ```
   - Increment angle mỗi frame
   - Smooth rotation effect
   - Controlled by state

5. **Cleanup**:
   ```tsx
   return () => {
     cancelAnimationFrame(animationFrameId);
     rendererRef.current.dispose();
   };
   ```
   - **Critical**: Stop animation loop
   - Release WebGL resources
   - Prevent memory leaks

### 4.5 useEffect - Load Model

```tsx
useEffect(() => {
  const loadModel = async () => {
    setStatus('loading');
    sceneRef.current.reset();

    try {
      if (currentFile) {
        // Load from file
        if (currentFile.name.endsWith('.ply')) {
          await SPLAT.PLYLoader.LoadFromFileAsync(
            currentFile, 
            sceneRef.current, 
            () => {}
          );
        } else if (currentFile.name.endsWith('.splat')) {
          await SPLAT.Loader.LoadFromFileAsync(
            currentFile, 
            sceneRef.current, 
            () => {}
          );
        }
      } else {
        // Load from URL
        await SPLAT.Loader.LoadAsync(
          defaultModelUrl, 
          sceneRef.current, 
          () => {}
        );
      }

      setStatus('success');
    } catch (error) {
      console.error('Error loading model:', error);
      setStatus('error');
    }
  };

  loadModel();
}, [currentFile, defaultModelUrl]);
```

**Giải thích:**

1. **Async Function Inside useEffect**:
   ```tsx
   useEffect(() => {
     const asyncFunction = async () => { ... };
     asyncFunction();
   }, [deps]);
   ```
   - useEffect không thể là async directly
   - Tạo async function bên trong
   - Call immediately

2. **Conditional Loading**:
   ```tsx
   if (currentFile) {
     // Load from file
   } else {
     // Load from URL
   }
   ```
   - Different loaders cho different sources
   - File extension detection

3. **Error Handling**:
   ```tsx
   try {
     await loader(...);
     setStatus('success');
   } catch (error) {
     setStatus('error');
   }
   ```
   - Graceful error handling
   - Update UI state accordingly

4. **Dependencies `[currentFile, defaultModelUrl]`**:
   - Effect chạy lại khi user upload file mới
   - Hoặc khi defaultModelUrl thay đổi

### 4.6 Event Handlers

```tsx
const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  setCurrentFile(file);
};
```

**Giải thích:**

1. **Type Annotation**:
   ```tsx
   (e: ChangeEvent<HTMLInputElement>)
   ```
   - `ChangeEvent`: React event type
   - `<HTMLInputElement>`: Generic type cho input element
   - Full type safety

2. **File Access**:
   ```tsx
   e.target.files
   ```
   - FileList object từ input element
   - `files[0]`: First selected file

3. **State Update**:
   ```tsx
   setCurrentFile(file);
   ```
   - Update state với File object
   - Triggers useEffect để load model

### 4.7 Fullscreen API

```tsx
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    containerRef.current?.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

useEffect(() => {
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  };
}, []);
```

**Giải thích:**

1. **Fullscreen API**:
   - `requestFullscreen()`: Enter fullscreen
   - `exitFullscreen()`: Exit fullscreen
   - `fullscreenElement`: Current fullscreen element (or null)

2. **Optional Chaining**:
   ```tsx
   containerRef.current?.requestFullscreen();
   ```
   - `?.`: Safe access
   - Only call if `current` exists

3. **Double Bang `!!`**:
   ```tsx
   !!document.fullscreenElement
   ```
   - Convert to boolean
   - `null` → `false`
   - Element → `true`

4. **Event Listener**:
   - Listen for fullscreen changes
   - Update state accordingly
   - Sync UI with fullscreen status

---

## 5. React Hooks Chi Tiết

### 5.1 useState Hook

**Cơ Bản:**

```tsx
const [count, setCount] = useState(0);
const [name, setName] = useState('John');
const [user, setUser] = useState<User | null>(null);
```

**Advanced Patterns:**

1. **Functional Updates**:
   ```tsx
   // ❌ Không nên (stale closure)
   setCount(count + 1);
   
   // ✅ Nên dùng (always latest value)
   setCount(prevCount => prevCount + 1);
   ```

2. **Lazy Initialization**:
   ```tsx
   // ❌ Expensive computation mỗi render
   const [data, setData] = useState(expensiveComputation());
   
   // ✅ Chỉ compute lần đầu
   const [data, setData] = useState(() => expensiveComputation());
   ```

3. **Multiple State Variables**:
   ```tsx
   // ✅ Separate concerns
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [data, setData] = useState(null);
   
   // ❌ Hoặc combine nếu liên quan
   const [state, setState] = useState({ loading: false, error: null, data: null });
   ```

### 5.2 useEffect Hook

**Syntax:**

```tsx
useEffect(() => {
  // Effect function
  
  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]);
```

**Dependency Array Patterns:**

1. **No Dependencies** (chạy mỗi render):
   ```tsx
   useEffect(() => {
     console.log('Runs every render');
   });
   ```

2. **Empty Array** (chỉ mount/unmount):
   ```tsx
   useEffect(() => {
     console.log('Mount');
     return () => console.log('Unmount');
   }, []);
   ```

3. **With Dependencies** (chạy khi deps change):
   ```tsx
   useEffect(() => {
     console.log('Count changed:', count);
   }, [count]);
   ```

**Common Use Cases:**

1. **API Calls**:
   ```tsx
   useEffect(() => {
     const fetchData = async () => {
       const response = await fetch(url);
       const data = await response.json();
       setData(data);
     };
     
     fetchData();
   }, [url]);
   ```

2. **Event Listeners**:
   ```tsx
   useEffect(() => {
     const handler = () => { /* ... */ };
     window.addEventListener('resize', handler);
     return () => window.removeEventListener('resize', handler);
   }, []);
   ```

3. **Timers**:
   ```tsx
   useEffect(() => {
     const timer = setInterval(() => {
       setCount(c => c + 1);
     }, 1000);
     
     return () => clearInterval(timer);
   }, []);
   ```

### 5.3 useRef Hook

**Use Cases:**

1. **DOM References**:
   ```tsx
   const inputRef = useRef<HTMLInputElement>(null);
   
   useEffect(() => {
     inputRef.current?.focus();
   }, []);
   
   return <input ref={inputRef} />;
   ```

2. **Mutable Values**:
   ```tsx
   const renderCount = useRef(0);
   
   useEffect(() => {
     renderCount.current += 1;
     console.log('Render count:', renderCount.current);
   });
   ```

3. **Previous Values**:
   ```tsx
   const usePrevious = <T,>(value: T): T | undefined => {
     const ref = useRef<T>();
     
     useEffect(() => {
       ref.current = value;
     }, [value]);
     
     return ref.current;
   };
   ```

---

## 6. State Management

### 6.1 Local State (useState)

**Khi Nào Dùng:**
- State chỉ dùng trong 1 component
- Simple UI state (open/closed, loading, etc.)
- Form inputs

**Ví Dụ:**

```tsx
const [isOpen, setIsOpen] = useState(false);
const [inputValue, setInputValue] = useState('');
```

### 6.2 Ref State (useRef)

**Khi Nào Dùng:**
- Values không cần trigger re-render
- DOM references
- Animation frame IDs
- Previous values

**Ví Dụ:**

```tsx
const animationRef = useRef<number>(0);
const canvasRef = useRef<HTMLCanvasElement>(null);
```

### 6.3 Derived State

**Pattern:**

```tsx
// ❌ Không nên: Redundant state
const [users, setUsers] = useState([]);
const [userCount, setUserCount] = useState(0);

// ✅ Nên: Derive from existing state
const [users, setUsers] = useState([]);
const userCount = users.length;
```

### 6.4 State Lifting

**Khi Nào:**
- Multiple components cần shared state
- Parent manages, children consume

**Ví Dụ:**

```tsx
// Parent
const [theme, setTheme] = useState('dark');
return (
  <>
    <NavBar theme={theme} />
    <Content theme={theme} setTheme={setTheme} />
  </>
);

// Child
interface Props {
  theme: string;
  setTheme: (theme: string) => void;
}
```

---

## 7. TypeScript Patterns

### 7.1 Component Props

```tsx
// Interface definition
interface GaussianViewerProps {
  defaultModelUrl?: string;  // Optional
  className?: string;
  onLoad?: () => void;      // Callback
}

// Component with typed props
export const GaussianViewer = ({
  defaultModelUrl = 'default.splat',  // Default value
  className = '',
  onLoad
}: GaussianViewerProps) => {
  // ...
};
```

### 7.2 Event Handlers

```tsx
// Input change
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// Button click
const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
};

// Form submit
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

### 7.3 Generic Types

```tsx
// Array state
const [items, setItems] = useState<string[]>([]);

// Object state
interface User {
  id: number;
  name: string;
}
const [user, setUser] = useState<User | null>(null);

// Ref
const divRef = useRef<HTMLDivElement>(null);
```

### 7.4 Type Guards

```tsx
// Check if error is Error type
if (error instanceof Error) {
  console.log(error.message);
}

// Check if value exists
if (value !== null && value !== undefined) {
  // Use value
}

// Type predicate
const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};
```

---

## 8. Styling với Tailwind CSS

### 8.1 Utility Classes

**Layout:**
```tsx
className="flex items-center justify-between"
//         ^     ^           ^
//         |     |           └─ Justify content
//         |     └─ Align items
//         └─ Display flex
```

**Sizing:**
```tsx
className="w-full h-screen"
//         ^      ^
//         |      └─ Height: 100vh
//         └─ Width: 100%
```

**Spacing:**
```tsx
className="p-4 mx-auto"
//         ^   ^
//         |   └─ Margin left/right: auto
//         └─ Padding: 1rem (16px)
```

### 8.2 Responsive Design

```tsx
className="grid grid-cols-1 md:grid-cols-3"
//                          ^^
//                          └─ Breakpoint prefix
```

**Breakpoints:**
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

### 8.3 State Variants

```tsx
className="
  hover:bg-blue-600 
  active:scale-95 
  focus:ring-2
"
```

### 8.4 Arbitrary Values

```tsx
className="h-[calc(100vh-180px)]"
//         ^
//         └─ Custom value
```

### 8.5 Template Literals

```tsx
const className = `
  base-class
  ${condition ? 'true-class' : 'false-class'}
  ${props.className || ''}
`;
```

---

## 9. Performance Optimization

### 9.1 Avoid Unnecessary Re-renders

**Problem:**
```tsx
// ❌ New object every render
<Component style={{ color: 'red' }} />

// ❌ New function every render
<button onClick={() => handleClick(id)}>Click</button>
```

**Solution:**
```tsx
// ✅ Static object
const style = { color: 'red' };
<Component style={style} />

// ✅ Use useCallback
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 9.2 Cleanup Side Effects

```tsx
useEffect(() => {
  const subscription = api.subscribe();
  
  // ✅ Always cleanup
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 9.3 Debounce Expensive Operations

```tsx
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    // Expensive search operation
    performSearch(searchTerm);
  }, 300);
  
  return () => clearTimeout(timer);
}, [searchTerm]);
```

### 9.4 Code Splitting

```tsx
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

---

## 10. Best Practices

### 10.1 Component Organization

```tsx
export const MyComponent = () => {
  // 1. Hooks (order matters!)
  const [state, setState] = useState();
  const ref = useRef();
  
  // 2. Effects
  useEffect(() => { ... }, []);
  
  // 3. Event handlers
  const handleClick = () => { ... };
  
  // 4. Derived values
  const computedValue = useMemo(() => { ... }, [deps]);
  
  // 5. Return JSX
  return <div>...</div>;
};
```

### 10.2 Naming Conventions

- **Components**: PascalCase (`NavBar`, `GaussianViewer`)
- **Functions**: camelCase (`handleClick`, `loadModel`)
- **Constants**: UPPER_CASE (`MAX_SIZE`, `API_URL`)
- **Booleans**: is/has prefix (`isLoading`, `hasError`)
- **Event handlers**: handle prefix (`handleSubmit`, `handleChange`)

### 10.3 File Structure

```
components/
├── NavBar/
│   ├── NavBar.tsx          # Component
│   ├── NavBar.test.tsx     # Tests
│   └── index.ts            # Export
└── GaussianViewer/
    ├── GaussianViewer.tsx
    └── index.ts
```

### 10.4 Error Handling

```tsx
// API calls
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('Unknown error');
  }
}

// Event handlers
const handleClick = (e: MouseEvent) => {
  try {
    dangerousOperation();
  } catch (error) {
    console.error('Operation failed:', error);
    showErrorToast();
  }
};
```

### 10.5 Accessibility

```tsx
// Use semantic HTML
<button type="button">Click</button>
<nav>...</nav>
<main>...</main>

// Add ARIA labels
<button aria-label="Close dialog">×</button>

// Keyboard navigation
<button onClick={handleClick} onKeyPress={handleKeyPress}>
  Action
</button>
```

---

## 📚 Tài Liệu Tham Khảo

### React Hooks
- [useState](https://react.dev/reference/react/useState)
- [useEffect](https://react.dev/reference/react/useEffect)
- [useRef](https://react.dev/reference/react/useRef)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind CSS
- [Documentation](https://tailwindcss.com/docs)
- [Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)

### 3D Graphics
- [gsplat Library](https://github.com/dylanebert/gsplat.js)
- [WebGL Fundamentals](https://webglfundamentals.org/)

---

**🎉 Chúc bạn coding vui vẻ!**

Nếu có thắc mắc, tham khảo:
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind Play](https://play.tailwindcss.com/)

---

<div align="center">

**Made with ❤️ using React 19 + Vite 7 + TypeScript + Tailwind CSS 4**

© 2025 VR Travel Redux | COLMAP_KLTN Team

</div> 
 