import { Product, Customer, Employee, Order, Supplier, StockAdjustment } from "@/lib/index";

export const CATEGORIES = ["All", "Food", "Beverages", "Electronics", "Personal Care", "Clothing"];
export const mockCategories = CATEGORIES;
export const categories = CATEGORIES;

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Amul Butter 500g", price: 285, categoryId: "Food", stock: 45, sku: "AMUL-BTR-500", costPrice: 240, lowStockThreshold: 10, unit: "pcs", images: ["/products/butter.png"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "2", name: "Parle-G 800g", price: 45, categoryId: "Food", stock: 120, sku: "PARLE-G-800", costPrice: 36, lowStockThreshold: 20, unit: "pcs", images: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=300"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "3", name: "Tata Salt 1kg", price: 22, categoryId: "Food", stock: 80, sku: "TATA-SLT-1KG", costPrice: 18, lowStockThreshold: 15, unit: "pcs", images: ["/products/salt.png"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "4", name: "Maggi Noodles 70g", price: 14, categoryId: "Food", stock: 200, sku: "MAGGI-70G", costPrice: 10, lowStockThreshold: 30, unit: "pcs", images: ["https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=300"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "5", name: "Colgate 200g", price: 89, categoryId: "Personal Care", stock: 60, sku: "COLG-200G", costPrice: 70, lowStockThreshold: 10, unit: "pcs", images: ["https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=300"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "6", name: "Dettol 200ml", price: 99, categoryId: "Personal Care", stock: 35, sku: "DETL-200ML", costPrice: 78, lowStockThreshold: 8, unit: "pcs", images: ["/products/handwash.png"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "7", name: "Lays Classic 26g", price: 20, categoryId: "Food", stock: 150, sku: "LAYS-CLS-26G", costPrice: 14, lowStockThreshold: 25, unit: "pcs", images: ["/products/chips.png"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "8", name: "Kurkure 90g", price: 30, categoryId: "Food", stock: 90, sku: "KURK-90G", costPrice: 22, lowStockThreshold: 15, unit: "pcs", images: ["/products/snacks.png"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "9", name: "Coca Cola 750ml", price: 40, categoryId: "Beverages", stock: 75, sku: "COKE-750ML", costPrice: 30, lowStockThreshold: 12, unit: "pcs", images: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "10", name: "Amul Milk 1L", price: 62, categoryId: "Beverages", stock: 50, sku: "AMUL-MLK-1L", costPrice: 55, lowStockThreshold: 10, unit: "pcs", images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=300"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "11", name: "Bisleri 1L", price: 20, categoryId: "Beverages", stock: 100, sku: "BISL-1L", costPrice: 12, lowStockThreshold: 20, unit: "pcs", images: ["/products/water.png"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
  { id: "12", name: "Boat Earphones", price: 999, categoryId: "Electronics", stock: 15, sku: "BOAT-ERPH-X", costPrice: 700, lowStockThreshold: 3, unit: "pcs", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300"], isActive: true, createdAt: new Date("2024-01-01"), updatedAt: new Date("2024-01-01") },
];
export const mockProducts = MOCK_PRODUCTS;

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Walk-in Customer", phone: "0000000000", totalOrders: 0, totalSpent: 0, isActive: true, createdAt: new Date("2024-01-01") },
  { id: "2", name: "Rajesh Kumar", phone: "9876543210", totalOrders: 5, totalSpent: 4500, isActive: true, createdAt: new Date("2024-01-01") },
  { id: "3", name: "Priya Sharma", phone: "9845678901", totalOrders: 3, totalSpent: 2800, isActive: true, createdAt: new Date("2024-01-01") },
  { id: "4", name: "Amit Patel", phone: "9823456789", totalOrders: 8, totalSpent: 9200, isActive: true, createdAt: new Date("2024-01-01") },
];
export const mockCustomers = MOCK_CUSTOMERS;

export const MOCK_EMPLOYEES: Employee[] = [
  { id: "1", name: "Suresh Patil", email: "suresh@pos.com", phone: "9000000001", role: "Cashier", department: "Mumbai", hireDate: new Date("2023-01-01"), isActive: true },
  { id: "2", name: "Kavita More", email: "kavita@pos.com", phone: "9000000002", role: "Cashier", department: "Mumbai", hireDate: new Date("2023-02-01"), isActive: true },
  { id: "3", name: "Rahul Singh", email: "rahul@pos.com", phone: "9000000003", role: "Manager", department: "Store Manager", hireDate: new Date("2022-06-01"), isActive: true },
  { id: "4", name: "Pooja Desai", email: "pooja@pos.com", phone: "9000000004", role: "Staff", department: "Inventory Staff", hireDate: new Date("2023-05-01"), isActive: true },
];
export const mockEmployees = MOCK_EMPLOYEES;

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: "1", name: "Amul Dairy", contactPerson: "Rajan Shah", email: "rajan@amul.com", phone: "9100000001", address: "Anand", city: "Anand, Gujarat", country: "India", totalPurchases: 450000, productsSupplied: ["1", "10"], isActive: true, createdAt: new Date("2023-01-01") },
  { id: "2", name: "Britannia", contactPerson: "Sunil Mehta", email: "sunil@britannia.com", phone: "9100000002", address: "Bengaluru", city: "Bengaluru", country: "India", totalPurchases: 280000, productsSupplied: ["2"], isActive: true, createdAt: new Date("2023-01-01") },
  { id: "3", name: "ITC Limited", contactPerson: "Arjun Roy", email: "arjun@itc.com", phone: "9100000003", address: "Kolkata", city: "Kolkata", country: "India", totalPurchases: 320000, productsSupplied: ["7", "8"], isActive: true, createdAt: new Date("2023-01-01") },
  { id: "4", name: "Nestlé India", contactPerson: "Priya Nair", email: "priya@nestle.com", phone: "9100000004", address: "Gurgaon", city: "Gurgaon", country: "India", totalPurchases: 190000, productsSupplied: ["4"], isActive: true, createdAt: new Date("2023-01-01") },
];
export const mockSuppliers = MOCK_SUPPLIERS;

export const mockStockAdjustments: StockAdjustment[] = [
  { id: "1", productId: "1", productName: "Amul Butter 500g", sku: "AMUL-BTR-500", type: "in", quantity: 50, previousStock: 20, newStock: 70, reason: "Regular restock from supplier", location: "Warehouse A", performedBy: "Rahul Singh", createdAt: new Date("2024-03-01") },
  { id: "2", productId: "6", productName: "Dettol 200ml", sku: "DETL-200ML", type: "out", quantity: 10, previousStock: 45, newStock: 35, reason: "Store front transfer", location: "Store Front", performedBy: "Kavita More", createdAt: new Date("2024-03-05") },
  { id: "3", productId: "3", productName: "Tata Salt 1kg", sku: "TATA-SLT-1KG", type: "damage", quantity: 5, previousStock: 85, newStock: 80, reason: "Damaged during transport", location: "Warehouse B", performedBy: "Suresh Patil", createdAt: new Date("2024-03-10") },
  { id: "4", productId: "9", productName: "Coca Cola 750ml", sku: "COKE-750ML", type: "return", quantity: 12, previousStock: 63, newStock: 75, reason: "Customer return - expired stock", location: "Warehouse A", performedBy: "Pooja Desai", createdAt: new Date("2024-03-12") },
];

export const mockOrders: Order[] = [];

