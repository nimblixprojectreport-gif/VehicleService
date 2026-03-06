import { createContext, useContext, useMemo, useState } from 'react';
import { loginApi, registerApi } from '../api/authApi';
import { getToken, removeToken, setToken } from '../utils/token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await loginApi(payload);
      const accessToken = response?.data?.token || response?.data?.access;
      if (accessToken) {
        setToken(accessToken);
        setAuthToken(accessToken);
      }
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await registerApi(payload);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), loading, login, register, logout }),
    [token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
