import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    const res = await apiLogin(data);
    localStorage.setItem('token', res.data.token);
    const payload = JSON.parse(atob(res.data.token.split('.')[1]));
    setUser(payload);
  };

  const register = async (data) => {
    await apiRegister(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </UserContext.Provider>
  );
}; 