import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/api/user/profile');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        message = 'Server is not running. Please start the backend server.';
      } else if (error.response?.status === 503) {
        message = 'Database is temporarily unavailable. Please try again later.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await apiClient.post('/api/auth/signup', { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      let message = 'Signup failed';
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        message = 'Server is not running. Please start the backend server.';
      } else if (error.response?.status === 503) {
        message = 'Database is temporarily unavailable. Please try again later.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.put('/api/user/profile', profileData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  const updateUserData = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    updateUserData,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};