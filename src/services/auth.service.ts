const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    username: string;
  };
}

/**
 * Đăng nhập
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  return response.json();
};

/**
 * Đăng ký tài khoản mới
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng ký thất bại');
  }

  return response.json();
};

/**
 * Lấy thông tin user hiện tại
 */
export const getCurrentUser = async (token: string): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/v1/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Không thể lấy thông tin user');
  }

  return response.json();
};

/**
 * Lưu token vào localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Lấy token từ localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};
