import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { StatCard } from '@/components/StatsCards';
import { SalesChart, CategoryChart, TopProductsChart } from '@/components/Charts';
import { mockProducts, mockOrders, mockCustomers } from '@/data/mockData';
import { formatCurrency, formatDate, isLowStock } from '@/lib/index';
import { IMAGES } from '@/assets/images';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesTrend: 0,
    ordersTrend: 0,
  });

  const [lowStockProducts, setLowStockProducts] = useState<typeof mockProducts>([]);
  const [recentOrders, setRecentOrders] = useState<typeof mockOrders>([]);

  useEffect(() => {
    const completedOrders = mockOrders.filter(order => order.status === 'completed');
    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = mockOrders.length;
    const totalProducts = mockProducts.length;
    const totalCustomers = mockCustomers.length;

    const lastWeekOrders = mockOrders.filter(
      order => new Date(order.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    const lastWeekSales = lastWeekOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);

    const salesTrend = lastWeekSales > 0 ? ((totalSales - lastWeekSales) / lastWeekSales) * 100 : 0;
    const ordersTrend = lastWeekOrders.length > 0 ? ((totalOrders - lastWeekOrders.length) / lastWeekOrders.length) * 100 : 0;

    setStats({
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers,
      salesTrend,
      ordersTrend,
    });

    const lowStock = mockProducts.filter(product => isLowStock(product)).slice(0, 5);
    setLowStockProducts(lowStock);

    const recent = [...mockOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setRecentOrders(recent);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStockStatusColor = (stock: number, threshold: number) => {
    if (stock === 0) return 'text-destructive';
    if (stock <= threshold) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-green-600 dark:text-green-500';
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {formatDate(new Date(), 'time')}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0 }}
          >
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              title="Total Sales"
              value={formatCurrency(stats.totalSales)}
              trend={{
                value: Math.abs(stats.salesTrend),
                isPositive: stats.salesTrend >= 0,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatCard
              icon={<ShoppingCart className="h-5 w-5" />}
              title="Total Orders"
              value={stats.totalOrders}
              trend={{
                value: Math.abs(stats.ordersTrend),
                isPositive: stats.ordersTrend >= 0,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatCard
              icon={<Package className="h-5 w-5" />}
              title="Total Products"
              value={stats.totalProducts}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <StatCard
              icon={<Users className="h-5 w-5" />}
              title="Total Customers"
              value={stats.totalCustomers}
            />
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-card rounded-xl border shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
              <SalesChart />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-card rounded-xl border shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
              <CategoryChart />
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="lg:col-span-2 bg-card rounded-xl border shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-mono">{order.orderNumber}</td>
                        <td className="py-3 px-4 text-sm">{order.customerName || 'Guest'}</td>
                        <td className="py-3 px-4 text-sm font-semibold">{formatCurrency(order.total)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(order.createdAt)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-card rounded-xl border shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
              </div>
              <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No low stock items</p>
                ) : (
                  lowStockProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="h-12 w-12 rounded-lg bg-background overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0] || IMAGES.ANALYTICS_1}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-semibold ${getStockStatusColor(product.stock, product.lowStockThreshold)}`}>
                          {product.stock} {product.unit}s
                        </p>
                        <p className="text-xs text-muted-foreground">Min: {product.lowStockThreshold}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="bg-card rounded-xl border shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
            <TopProductsChart />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}