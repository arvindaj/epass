import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = axios.create({ baseURL: '/api' });

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('epass_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('epass_token');
    const savedUser = localStorage.getItem('epass_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    return res.data;
  };

  const verifyOTP = async (userId, otp) => {
    const res = await API.post('/auth/verify-otp', { userId, otp });
    if (res.data.success) {
      localStorage.setItem('epass_token', res.data.token);
      localStorage.setItem('epass_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('epass_token', res.data.token);
      localStorage.setItem('epass_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('epass_token');
    localStorage.removeItem('epass_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, verifyOTP, login, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API };
