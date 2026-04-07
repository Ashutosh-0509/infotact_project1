import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { SalesChart, CategoryChart, TopProductsChart } from '@/components/Charts';
import { formatCurrency, formatDate } from '@/lib/index';
import { mockOrders, mockProducts, mockCustomers } from '@/data/mockData';
import { IMAGES } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type DateRange = '7days' | '30days' | '90days' | 'year' | 'all';
type ReportType = 'sales' | 'inventory' | 'financial' | 'customers';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

function MetricCard({ title, value, change, icon, trend }: MetricCardProps) {
  const isPositive = trend === 'up';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          <div className="flex items-center gap-2 mt-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface TopPerformerProps {
  rank: number;
  name: string;
  value: string;
  metric: string;
}

function TopPerformer({ rank, name, value, metric }: TopPerformerProps) {
  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
  const medalColor = rank <= 3 ? medalColors[rank - 1] : 'text-muted-foreground';
  
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className={`text-lg font-bold ${medalColor} w-6`}>#{rank}</div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{metric}</div>
        </div>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const [reportType, setReportType] = useState<ReportType>('sales');

  const totalRevenue = mockOrders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  const totalOrders = mockOrders.filter(order => order.status === 'completed').length;
  const totalCustomers = mockCustomers.length;
  const totalProducts = mockProducts.length;

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const lowStockProducts = mockProducts.filter(
    product => product.stock <= product.lowStockThreshold
  );

  const outOfStockProducts = mockProducts.filter(product => product.stock === 0);

  const topProducts = mockProducts
    .sort((a, b) => b.price * (100 - b.stock) - a.price * (100 - a.stock))
    .slice(0, 5);

  const topCustomers = mockCustomers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting report as ${format}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url(${IMAGES.ANALYTICS_2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />

        <div className="relative z-10 p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive insights into your business performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              change={12.5}
              icon={<DollarSign className="h-5 w-5" />}
              trend="up"
            />
            <MetricCard
              title="Total Orders"
              value={totalOrders.toString()}
              change={8.2}
              icon={<ShoppingCart className="h-5 w-5" />}
              trend="up"
            />
            <MetricCard
              title="Total Customers"
              value={totalCustomers.toString()}
              change={15.3}
              icon={<Users className="h-5 w-5" />}
              trend="up"
            />
            <MetricCard
              title="Avg Order Value"
              value={formatCurrency(averageOrderValue)}
              change={-2.4}
              icon={<Activity className="h-5 w-5" />}
              trend="down"
            />
          </div>

          <Tabs value={reportType} onValueChange={(value) => setReportType(value as ReportType)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Sales
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Daily revenue over the selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SalesChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>Product category distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CategoryChart />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Best performing products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopProductsChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Products</CardTitle>
                  <CardDescription>Highest revenue generators</CardDescription>
                </CardHeader>
                <CardContent>
                  {topProducts.map((product, index) => (
                    <TopPerformer
                      key={product.id}
                      rank={index + 1}
                      name={product.name}
                      value={formatCurrency(product.price * (100 - product.stock))}
                      metric={`${100 - product.stock} units sold`}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{totalProducts}</div>
                    <p className="text-sm text-muted-foreground mt-2">Active SKUs</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-amber-600">
                      {lowStockProducts.length}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Needs reordering</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Out of Stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-red-600">
                      {outOfStockProducts.length}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Urgent action required</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Alert</CardTitle>
                  <CardDescription>Products requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.sku}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">{product.stock} units</div>
                            <div className="text-sm text-muted-foreground">
                              Threshold: {product.lowStockThreshold}
                            </div>
                          </div>
                          <Badge variant={product.stock === 0 ? 'destructive' : 'secondary'}>
                            {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Summary</CardTitle>
                    <CardDescription>Financial overview for selected period</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Gross Revenue</span>
                      <span className="text-xl font-bold">{formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="text-xl font-bold">{totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Average Order Value</span>
                      <span className="text-xl font-bold">{formatCurrency(averageOrderValue)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-muted-foreground">Profit Margin</span>
                      <span className="text-xl font-bold text-green-600">32.5%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Transaction breakdown by payment type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['card', 'cash', 'digital', 'split'].map((method) => {
                      const methodOrders = mockOrders.filter(
                        (order) => order.paymentMethod === method && order.status === 'completed'
                      );
                      const methodRevenue = methodOrders.reduce(
                        (sum, order) => sum + order.total,
                        0
                      );
                      const percentage = totalRevenue > 0 ? (methodRevenue / totalRevenue) * 100 : 0;

                      return (
                        <div key={method} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="capitalize font-medium">{method}</span>
                            <span className="text-sm text-muted-foreground">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(methodRevenue)}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{totalCustomers}</div>
                    <p className="text-sm text-muted-foreground mt-2">Active accounts</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Avg Customer Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {formatCurrency(
                        mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Lifetime value</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Loyalty Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">
                      {mockCustomers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Total points issued</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Customers</CardTitle>
                  <CardDescription>Highest spending customers</CardDescription>
                </CardHeader>
                <CardContent>
                  {topCustomers.map((customer, index) => (
                    <TopPerformer
                      key={customer.id}
                      rank={index + 1}
                      name={customer.name}
                      value={formatCurrency(customer.totalSpent)}
                      metric={`${customer.totalOrders} orders`}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                  <CardDescription>Customers by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(mockCustomers.map((c) => c.city))).map((city) => {
                      const cityCustomers = mockCustomers.filter((c) => c.city === city);
                      const percentage = (cityCustomers.length / totalCustomers) * 100;

                      return (
                        <div key={city} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{city}</span>
                            <span className="text-sm text-muted-foreground">
                              {cityCustomers.length} customers ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
