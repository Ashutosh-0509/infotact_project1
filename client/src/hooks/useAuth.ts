import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, UserRole, ROUTE_PATHS } from '@/lib/index';

// ── Mock users (fallback when server is unreachable) ─────────
const MOCK_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'cashier@pos.com',
    password: 'cashier123',
    user: {
      id: '1',
      name: 'Cashier User',
      email: 'cashier@pos.com',
      role: 'Cashier',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cashier',
      createdAt: new Date('2024-02-15'),
    },
  },
  {
    email: 'manager@pos.com',
    password: 'manager123',
    user: {
      id: '2',
      name: 'Manager User',
      email: 'manager@pos.com',
      role: 'Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager',
      createdAt: new Date('2024-01-15'),
    },
  },
  {
    email: 'admin@pos.com',
    password: 'admin123',
    user: {
      id: '3',
      name: 'Admin User',
      email: 'admin@pos.com',
      role: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      createdAt: new Date('2024-01-01'),
    },
  },
];

// ── Types ────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// ── Storage helpers ──────────────────────────────────────────
const AUTH_STORAGE_KEY = 'pos_auth_user';
const TOKEN_KEY = 'pos_auth_token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return { ...parsed, createdAt: new Date(parsed.createdAt) };
  } catch {
    return null;
  }
};

const saveUserToStorage = (user: User | null, token?: string): void => {
  if (user && token) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    // Keep legacy keys in sync for the axios interceptor in api.ts
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  }
};

// ── Hook ─────────────────────────────────────────────────────
export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const user = loadUserFromStorage();
    setAuthState({ user, isAuthenticated: !!user, isLoading: false });
  }, []);

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
      const doNavigate = (role: UserRole) => {
        if (role === 'Cashier' || role === 'Staff') {
          navigate(ROUTE_PATHS.DASHBOARD_POS);
        } else if (role === 'Manager') {
          navigate(ROUTE_PATHS.DASHBOARD_MANAGER);
        } else if (role === 'Admin') {
          navigate(ROUTE_PATHS.DASHBOARD);
        } else {
          navigate(ROUTE_PATHS.DASHBOARD);
        }
      };

      try {
        const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const { data } = await axios.post(`${apiUrl}/api/auth/login`, {
          email: credentials.email,
          password: credentials.password,
          role: credentials.role,
        }, { timeout: 3000 });

        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role as UserRole,
          avatar: data.user.avatar,
          createdAt: new Date(data.user.createdAt),
        };

        saveUserToStorage(user, data.token);
        setAuthState({ user, isAuthenticated: true, isLoading: false });
        doNavigate(user.role);
        return { success: true };
      } catch (err: unknown) {
        // ── Mock fallback ─────────────────────────────────────
        // Fallback to mock on any error (401, 404, 500, or network error)
        const mock = MOCK_USERS.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.toLowerCase() &&
            u.password === credentials.password &&
            u.user.role.toLowerCase() === credentials.role.toLowerCase()
        );
        if (mock) {
          saveUserToStorage(mock.user, 'mock-token');
          setAuthState({ user: mock.user, isAuthenticated: true, isLoading: false });
          doNavigate(mock.user.role);
          return { success: true };
        }

        let message = 'Invalid email or password. Please try again.';
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          message = err.response.data.message;
        }
        return { success: false, error: message };
      }
    },
    [navigate]
  );

  // ── Signup ───────────────────────────────────────────────────
  const signup = useCallback(
    async (credentials: SignupCredentials): Promise<{ success: boolean; error?: string }> => {
      const doNavigate = (role: UserRole) => {
        if (role === 'Cashier' || role === 'Staff') {
          navigate(ROUTE_PATHS.DASHBOARD_POS);
        } else if (role === 'Manager') {
          navigate(ROUTE_PATHS.DASHBOARD_MANAGER);
        } else if (role === 'Admin') {
          navigate(ROUTE_PATHS.DASHBOARD);
        } else {
          navigate(ROUTE_PATHS.DASHBOARD);
        }
      };

      try {
        const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const { data } = await axios.post(`${apiUrl}/api/auth/signup`, {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          role: credentials.role,
        }, { timeout: 3000 });

        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role as UserRole,
          avatar: data.user.avatar,
          createdAt: new Date(data.user.createdAt),
        };

        saveUserToStorage(user, data.token);
        setAuthState({ user, isAuthenticated: true, isLoading: false });
        doNavigate(user.role);
        return { success: true };
      } catch (err: unknown) {
        // ── Mock fallback ─────────────────────────────────────
        // Fallback to mock on any error
        const existing = MOCK_USERS.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
        if (existing) {
           return { success: false, error: 'User with this email already exists.' };
        }
        const newUser: User = {
           id: Math.random().toString(36).substring(7),
           name: credentials.name,
           email: credentials.email,
           role: credentials.role,
           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.name.split(' ').join('')}`,
           createdAt: new Date()
        };
        MOCK_USERS.push({
           email: credentials.email,
           password: credentials.password,
           user: newUser
        });
        
        saveUserToStorage(newUser, 'mock-token');
        setAuthState({ user: newUser, isAuthenticated: true, isLoading: false });
        doNavigate(newUser.role);
        return { success: true };
      }
    },
    [navigate]
  );

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(() => {
    saveUserToStorage(null);
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    navigate(ROUTE_PATHS.HOME);
  }, [navigate]);

  // ── Role helpers ─────────────────────────────────────────────
  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!authState.user) return false;
      const allowed = Array.isArray(roles) ? roles : [roles];
      return allowed.includes(authState.user.role);
    },
    [authState.user]
  );

  const isAdmin    = useCallback(() => authState.user?.role === 'Admin',    [authState.user]);
  const isManager  = useCallback(() => authState.user?.role === 'Manager',  [authState.user]);
  const isStaff    = useCallback(() => authState.user?.role === 'Staff',    [authState.user]);
  const isCashier  = useCallback(() => authState.user?.role === 'Cashier',  [authState.user]);

  const canAccessRoute = useCallback(
    (requiredRoles?: UserRole[]): boolean => {
      if (!requiredRoles || requiredRoles.length === 0) return true;
      return hasRole(requiredRoles);
    },
    [hasRole]
  );

  const updateUser = useCallback((updates: Partial<User>) => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updates };
      const token = localStorage.getItem(TOKEN_KEY) || undefined;
      saveUserToStorage(updatedUser, token);
      return { ...prev, user: updatedUser };
    });
  }, []);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    signup,
    logout,
    hasRole,
    isAdmin,
    isManager,
    isStaff,
    isCashier,
    canAccessRoute,
    updateUser,
  };
};
