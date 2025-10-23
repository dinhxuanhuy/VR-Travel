import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import * as authService from "../services/auth.service";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token khi mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = authService.getToken();
      if (savedToken) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
          setToken(savedToken);
        } catch (error) {
          console.error("Invalid token:", error);
          authService.removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      const { token: newToken, user: userData } = response.data;

      authService.saveToken(newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authService.register({
        username,
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;

      authService.saveToken(newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.removeToken();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
