import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, ROUTE_PATHS } from '@/lib/index';

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

const AUTH_STORAGE_KEY = 'pos_auth_user';

const mockUsers: Record<string, { password: string; user: Omit<User, 'id'> }> = {
  'admin@pos.com': {
    password: 'admin123',
    user: {
      email: 'admin@pos.com',
      name: 'Admin User',
      role: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      createdAt: new Date('2024-01-01'),
    },
  },
  'manager@pos.com': {
    password: 'manager123',
    user: {
      email: 'manager@pos.com',
      name: 'Manager User',
      role: 'Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager',
      createdAt: new Date('2024-01-15'),
    },
  },
  'staff@pos.com': {
    password: 'staff123',
    user: {
      email: 'staff@pos.com',
      name: 'Staff User',
      role: 'Staff',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff',
      createdAt: new Date('2024-02-01'),
    },
  },
};

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  } catch {
    return null;
  }
};

const saveUserToStorage = (user: User | null): void => {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const user = loadUserFromStorage();
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
      try {
        const mockUser = mockUsers[credentials.email];
        
        if (!mockUser) {
          return { success: false, error: 'Invalid email or password' };
        }
        
        if (mockUser.password !== credentials.password) {
          return { success: false, error: 'Invalid email or password' };
        }
        
        if (mockUser.user.role !== credentials.role) {
          return { success: false, error: 'Invalid role selected' };
        }
        
        const user: User = {
          id: Math.random().toString(36).substring(2, 11),
          ...mockUser.user,
        };
        
        saveUserToStorage(user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        navigate(ROUTE_PATHS.DASHBOARD);
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Login failed. Please try again.' };
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    saveUserToStorage(null);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate(ROUTE_PATHS.LOGIN);
  }, [navigate]);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!authState.user) return false;
      
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      return allowedRoles.includes(authState.user.role);
    },
    [authState.user]
  );

  const isAdmin = useCallback((): boolean => {
    return authState.user?.role === 'Admin';
  }, [authState.user]);

  const isManager = useCallback((): boolean => {
    return authState.user?.role === 'Manager';
  }, [authState.user]);

  const isStaff = useCallback((): boolean => {
    return authState.user?.role === 'Staff';
  }, [authState.user]);

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
      saveUserToStorage(updatedUser);
      
      return {
        ...prev,
        user: updatedUser,
      };
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
    canAccessRoute,
    updateUser,
  };
};
