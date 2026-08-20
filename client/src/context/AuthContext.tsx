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
          const res = await authService.getMe();
          // Server returns { success, data: { user } }
          const userData = res.data?.user || res.user || res.data;
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth initialization failed', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []); // Only run once on mount, not on every token change

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    // Server returns { success, data: { token, user } }
    const newToken = res.data?.token || res.token;
    const userData = res.data?.user || res.user;
    
    if (!newToken || !userData) {
      throw new Error(res.message || 'Login failed — invalid response from server');
    }

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const register = async (userData: any) => {
    const res = await authService.register(userData);
    // Server returns { success, data: { token, user } }
    const newToken = res.data?.token || res.token;
    const newUserData = res.data?.user || res.user;
    
    if (!newToken || !newUserData) {
      throw new Error(res.message || 'Registration failed — invalid response from server');
    }

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUserData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
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
