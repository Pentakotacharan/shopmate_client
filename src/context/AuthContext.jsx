import { createContext, useState } from 'react';
import axios from 'axios';


const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password }, config);
      setUser(data);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      console.log("Error details:", error.response?.data);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password }, config);
      setUser(data);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      console.log("Error details:", error.response?.data);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;