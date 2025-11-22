import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

