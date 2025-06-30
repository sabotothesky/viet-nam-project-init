import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  rank: string;
  created_at: Date;
  updated_at: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      // Simulate checking authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data for development
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        username: 'pool_player',
        avatar_url: '/avatars/default.jpg',
        rank: 'A+',
        created_at: new Date(),
        updated_at: new Date(),
      };

      setUser(mockUser);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (email === 'test@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email: email,
          username: 'pool_player',
          avatar_url: '/avatars/default.jpg',
          rank: 'A+',
          created_at: new Date(),
          updated_at: new Date(),
        };

        setUser(mockUser);
        localStorage.setItem('auth_token', 'mock_token');
      } else {
        throw new Error('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (password.length < 6) {
        throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
      }

      const mockUser: User = {
        id: Date.now().toString(),
        email: email,
        username: username,
        avatar_url: '/avatars/default.jpg',
        rank: 'C',
        created_at: new Date(),
        updated_at: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (user) {
        const updatedUser = { ...user, ...data, updated_at: new Date() };
        setUser(updatedUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock success
      console.log('Password reset email sent to:', email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi email thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
