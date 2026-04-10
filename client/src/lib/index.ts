export const ROUTE_PATHS = {
  HOME: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  LOGIN_CASHIER: '/login/cashier',
  LOGIN_MANAGER: '/login/manager',
  LOGIN_ADMIN: '/login/admin',
  DASHBOARD: '/dashboard',
  DASHBOARD_SALES: '/dashboard/sales',
  DASHBOARD_INVENTORY: '/dashboard/inventory',
  DASHBOARD_CUSTOMERS: '/dashboard/customers',
  DASHBOARD_REPORTS: '/dashboard/reports',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_POS: '/dashboard/pos',
  DASHBOARD_MANAGER: '/dashboard/manager',
  DASHBOARD_ADMIN: '/dashboard/admin',
  PRODUCTS: '/products',
  INVENTORY: '/inventory',
  POS: '/pos',
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  SUPPLIERS: '/suppliers',
  EMPLOYEES: '/employees',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  AI_PREDICTIONS: '/ai-predictions',
} as const;

export type UserRole = 'Admin' | 'Manager' | 'Staff' | 'Cashier';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  barcode?: string;
  images: string[];
  variants?: ProductVariant[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'digital' | 'split';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentTerms?: string;
  productsSupplied: string[];
  totalPurchases: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string;
  salary?: number;
  hireDate: Date;
  isActive: boolean;
  avatar?: string;
  address?: string;
  emergencyContact?: string;
}

export type StockAdjustmentType = 'in' | 'out' | 'adjustment' | 'return' | 'damage';

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: StockAdjustmentType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  location?: string;
  performedBy: string;
  createdAt: Date;
}

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'time') {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  }
  
  if (format === 'long') {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const generateSKU = (prefix: string = 'PRD'): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const calculateOrderTotal = (items: OrderItem[], taxRate: number = 0.1): { subtotal: number; tax: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
};

export const isLowStock = (product: Product): boolean => {
  return product.stock <= product.lowStockThreshold;
};

export const getStockStatus = (product: Product): 'in-stock' | 'low-stock' | 'out-of-stock' => {
  if (product.stock === 0) return 'out-of-stock';
  if (product.stock <= product.lowStockThreshold) return 'low-stock';
  return 'in-stock';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
