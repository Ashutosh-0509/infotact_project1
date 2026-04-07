import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, UserRole, ROUTE_PATHS } from '@/lib/index';

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
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/login`, {
          email: credentials.email,
          password: credentials.password,
          role: credentials.role,
        });

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

        // Role-based redirect
        if (user.role === 'Cashier' || user.role === 'Staff') {
          navigate(ROUTE_PATHS.POS);
        } else if (user.role === 'Manager') {
          navigate(ROUTE_PATHS.INVENTORY);
        } else {
          navigate(ROUTE_PATHS.DASHBOARD);
        }

        return { success: true };
      } catch (err: unknown) {
        let message = 'Login failed. Please try again.';
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          message = err.response.data.message;
        }
        return { success: false, error: message };
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
