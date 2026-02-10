import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router';

export interface User {
  id: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female';
  mazhab: 'muhammadiyah' | 'nu';
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  fullName: string;
  age: number;
  gender: 'male' | 'female';
  mazhab: 'muhammadiyah' | 'nu';
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('ramadhan_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('ramadhan_users') || '[]');
      
      // Check if email already exists
      if (users.find((u: any) => u.email === data.email)) {
        return false;
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        fullName: data.fullName,
        age: data.age,
        gender: data.gender,
        mazhab: data.mazhab,
        email: data.email,
        createdAt: new Date().toISOString(),
      };

      // Store user credentials
      users.push({
        ...newUser,
        password: data.password, // In real app, this would be hashed
      });

      localStorage.setItem('ramadhan_users', JSON.stringify(users));
      localStorage.setItem('ramadhan_user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('ramadhan_users') || '[]');
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        localStorage.setItem('ramadhan_user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ramadhan_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
