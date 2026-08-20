import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await authService.getMe();
          setUser(data.user || data.data); // Adjust based on API structure
        } catch (error) {
          console.error('Auth initialization failed', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    const newToken = res.token || res.data?.token;
    const userData = res.user || res.data?.user;
    
    if (newToken && userData) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
    }
  };

  const register = async (userData: any) => {
    const res = await authService.register(userData);
    const newToken = res.token || res.data?.token;
    const newUserData = res.user || res.data?.user;
    
    if (newToken && newUserData) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUserData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
