import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { StatCard } from '@/components/StatsCards';
import { SalesChart, CategoryChart, TopProductsChart } from '@/components/Charts';
import { mockProducts, mockOrders, mockCustomers } from '@/data/mockData';
import { formatCurrency, formatDate, isLowStock, ROUTE_PATHS } from '@/lib/index';
import { IMAGES } from '@/assets/images';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  MoreVertical,
  X,
  Calendar,
  CreditCard,
  Hash,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState<'revenue' | 'growth'>('revenue');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
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
    // Mocking some orders since mockOrders is empty in mockData.ts
    const demoOrders = [
      { id: '1', orderNumber: '#T89341', customerName: 'Rajesh Kumar', total: 1250, status: 'completed', createdAt: new Date().toISOString(), paymentMethod: 'UPI', items: 4 },
      { id: '2', orderNumber: '#T89342', customerName: 'Priya Sharma', total: 850, status: 'pending', createdAt: new Date().toISOString(), paymentMethod: 'Cash', items: 2 },
      { id: '3', orderNumber: '#T89343', customerName: 'Amit Patel', total: 450, status: 'completed', createdAt: new Date().toISOString(), paymentMethod: 'Card', items: 1 },
      { id: '4', orderNumber: '#T89344', customerName: 'Sunita Devi', total: 2100, status: 'cancelled', createdAt: new Date().toISOString(), paymentMethod: 'UPI', items: 6 },
      { id: '5', orderNumber: '#T89345', customerName: 'Walk-in', total: 600, status: 'completed', createdAt: new Date().toISOString(), paymentMethod: 'Cash', items: 3 },
    ];
    
    const completedOrders = demoOrders.filter(order => order.status === 'completed');
    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = demoOrders.length;
    const totalProducts = mockProducts.length;
    const totalCustomers = mockCustomers.length + 4; // Mocking more for UI

    setStats({
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers,
      salesTrend: 12.5,
      ordersTrend: 8.2,
    });

    const lowStock = mockProducts.filter(product => isLowStock(product)).slice(0, 5);
    setLowStockProducts(lowStock);

    setRecentOrders(demoOrders as any);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleRefresh = () => {
    toast.info('Refreshing dashboard data...', {
      className: 'bg-background border-primary/50 text-foreground',
    });
  };

  return (
    <div className="theme-neon-blue">
      <Layout>
        <div className="space-y-10 pb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase border-l-4 border-primary pl-4">DASHBOARD</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-tight mt-1 ml-5">Welcome back, Admin. System is running at optimal capacity.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Live Updates</span>
             </div>
             <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">System Time</p>
                <p className="text-sm font-bold font-mono">{formatDate(new Date(), 'time')}</p>
             </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="relative group p-6 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all overflow-hidden cursor-pointer" onClick={() => navigate(ROUTE_PATHS.DASHBOARD_SALES)}>
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl w-fit mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">DAILY REVENUE</p>
              <h3 className="text-3xl font-black">{formatCurrency(stats.totalSales)}</h3>
              <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-green-400">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12.5% FROM YESTERDAY</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="relative group p-6 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all overflow-hidden cursor-pointer" onClick={() => navigate(ROUTE_PATHS.DASHBOARD_SALES)}>
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl w-fit mb-4">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">TOTAL SALES</p>
              <h3 className="text-3xl font-black">{stats.totalOrders}</h3>
              <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-primary">
                <ArrowUpRight className="w-3 h-3" />
                <span>+8.2% FROM LAST WEEK</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="relative group p-6 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all overflow-hidden cursor-pointer" onClick={() => navigate(ROUTE_PATHS.DASHBOARD_REPORTS)}>
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl w-fit mb-4">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">AVG ORDER VALUE</p>
              <h3 className="text-3xl font-black">{formatCurrency(stats.totalSales / (stats.totalOrders || 1))}</h3>
              <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-purple-400">
                <ArrowUpRight className="w-3 h-3" />
                <span>STABLE TREND</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="relative group p-6 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all overflow-hidden cursor-pointer" onClick={() => navigate(ROUTE_PATHS.DASHBOARD_SALES + '?filter=pending')}>
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-fit mb-4">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-1">PENDING ORDERS</p>
              <h3 className="text-3xl font-black">1</h3>
              <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                <span>REQUIRES ATTENTION</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-card/30 backdrop-blur-xl rounded-[3rem] border border-primary/10 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" /> 
                {chartType === 'revenue' ? 'REVENUE OVERVIEW' : 'GROWTH ANALYTICS'}
              </h2>
              <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-primary/10">
                <Button 
                  variant={chartType === 'revenue' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setChartType('revenue')}
                  className={`rounded-lg px-4 h-8 text-[10px] font-black uppercase tracking-widest ${chartType === 'revenue' ? 'bg-primary/20 text-primary border border-primary/30' : ''}`}
                >
                  REVENUE
                </Button>
                <Button 
                  variant={chartType === 'growth' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setChartType('growth')}
                  className={`rounded-lg px-4 h-8 text-[10px] font-black uppercase tracking-widest ${chartType === 'growth' ? 'bg-primary/20 text-primary border border-primary/30' : ''}`}
                >
                  GROWTH
                </Button>
              </div>
            </div>
            <div className="h-[300px]">
              <SalesChart />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-card/20 backdrop-blur-xl rounded-[3rem] border border-primary/5 p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">CATEGORY DISTRIBUTION</h2>
            <div className="h-[300px]">
              <CategoryChart />
            </div>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card/30 backdrop-blur-xl rounded-[3rem] border border-primary/10 overflow-hidden">
          <div className="p-8 border-b border-primary/10 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-primary" /> RECENT TRANSACTIONS
            </h2>
            <div className="flex gap-3">
               <Link to={ROUTE_PATHS.DASHBOARD_SALES}>
                <Button variant="ghost" className="text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px] rounded-xl h-10 px-4">VIEW ALL</Button>
               </Link>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-full h-10 w-10">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-xl border-primary/20 rounded-xl overflow-hidden shadow-2xl">
                    <DropdownMenuItem onClick={() => navigate(ROUTE_PATHS.DASHBOARD_SALES)} className="px-4 py-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10 focus:text-primary">VIEW ALL TRANSACTIONS</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success('Exporting as PDF...')} className="px-4 py-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10 focus:text-primary">EXPORT AS PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success('Exporting as EXCEL...')} className="px-4 py-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10 focus:text-primary">EXPORT AS EXCEL</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRefresh} className="px-4 py-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10 focus:text-primary">REFRESH DATA</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-primary/5 bg-white/5 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">
                  <th className="py-5 px-8">TRANS ID</th>
                  <th className="py-5 px-8">CUSTOMER</th>
                  <th className="py-5 px-8">TOTAL</th>
                  <th className="py-5 px-8">METHOD</th>
                  <th className="py-5 px-8">STATUS</th>
                  <th className="py-5 px-8">DATE</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="border-b border-primary/5 last:border-0 hover:bg-primary/[0.03] transition-colors group cursor-pointer"
                    onClick={() => setSelectedTransaction(order)}
                  >
                    <td className="py-6 px-8 font-mono text-sm font-black text-primary group-hover:shadow-[0_0_10px_rgba(var(--primary),0.3)] transition-all">{order.orderNumber}</td>
                    <td className="py-6 px-8 text-sm font-bold tracking-tight">{order.customerName || 'Guest'}</td>
                    <td className="py-6 px-8 text-lg font-black">{formatCurrency(order.total)}</td>
                    <td className="py-6 px-8">
                       <Badge variant="outline" className="border-primary/10 rounded-lg text-[9px] uppercase font-black px-2">{order.paymentMethod}</Badge>
                    </td>
                    <td className="py-6 px-8">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${getStatusColor(order.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'completed' ? 'bg-green-400' : order.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                        {order.status}
                      </div>
                    </td>
                    <td className="py-6 px-8 text-[11px] text-muted-foreground uppercase font-bold tracking-widest">{formatDate(order.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTransaction(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative w-full max-w-lg bg-card/60 backdrop-blur-3xl border border-primary/30 rounded-[3rem] overflow-hidden shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                     <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase">TRANSACTION DETAILS</h3>
                    <p className="text-primary font-mono text-sm font-bold">{selectedTransaction.orderNumber}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(null)} className="rounded-full hover:bg-white/10 h-10 w-10">
                   <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-3xl bg-black/30 border border-white/5">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">CUSTOMER</p>
                      <p className="font-bold text-lg">{selectedTransaction.customerName}</p>
                   </div>
                   <div className="p-4 rounded-3xl bg-black/30 border border-white/5">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">DATE/TIME</p>
                      <p className="font-bold text-sm uppercase">{formatDate(selectedTransaction.createdAt, 'long')}</p>
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-black/40 border border-primary/10 space-y-4">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs">4x</div>
                         <span className="font-bold">Items Purchased</span>
                      </div>
                      <span className="font-black text-xl">{formatCurrency(selectedTransaction.total)}</span>
                   </div>
                   <div className="flex items-center justify-between pt-2">
                       <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">PAYMENT METHOD</span>
                       <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest text-[9px] px-3">{selectedTransaction.paymentMethod}</Badge>
                   </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-3xl border border-primary/30 bg-primary/5">
                    <span className="font-black uppercase tracking-widest text-xs">ORDER STATUS</span>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tight ${getStatusColor(selectedTransaction.status)}`}>
                        <div className={`w-2 h-2 rounded-full ${selectedTransaction.status === 'completed' ? 'bg-green-400' : 'bg-red-400'}`} />
                        {selectedTransaction.status}
                    </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl h-16 shadow-[0_10px_30px_rgba(var(--primary),0.3)] gap-2 mt-4 uppercase tracking-tighter">
                   PRINT RECEIPT
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
    </div>
  );
}