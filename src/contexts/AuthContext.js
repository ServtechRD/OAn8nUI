import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getUserData,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中是否有用户数据
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await apiLogin(username, password);
    if (result.success) {
      setUser(result.data);
    }
    return result;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
