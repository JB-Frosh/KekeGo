import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Student } from '../types';

interface AuthContextValue {
  isAuthenticated: boolean;
  currentUser: Student | null;
  login: (user: Student) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Student | null>(() => {
    const stored = localStorage.getItem('kekego-student');
    return stored ? (JSON.parse(stored) as Student) : null;
  });

  const login = useCallback((user: Student) => {
    setCurrentUser(user);
    localStorage.setItem('kekego-student', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('kekego-student');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(currentUser),
      currentUser,
      login,
      logout,
    }),
    [currentUser, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
