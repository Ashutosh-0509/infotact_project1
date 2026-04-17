import { useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  ChevronDown,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Users,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SalesChart, CategoryChart, TopProductsChart } from '@/components/Charts';
import { toast } from 'sonner';

export default function Reports() {
  const [dateRange, setDateRange] = useState('Month');

  const handleExport = (type: string) => {
    toast.info(`Exporting as ${type}...`, {
      description: "Your file will be ready in a moment.",
      className: 'bg-background border-primary/50 text-foreground',
    });

    setTimeout(() => {
      toast.success(`${type} Export Complete`, {
        className: 'bg-background border-green-500/50 text-green-400',
      });
    }, 2000);
  };

  const kpis = [
    { title: "Net Profit", value: "₹1,45,230", trend: "+12.5%", icon: DollarSign, color: "text-green-400" },
    { title: "Avg Order Value", value: "₹1,240", trend: "+8.2%", icon: ShoppingCart, color: "text-blue-400" },
    { title: "Customer Growth", value: "15.3%", trend: "+5.1%", icon: Users, color: "text-purple-400" },
    { title: "Retention Rate", value: "78%", trend: "+2.4%", icon: Percent, color: "text-orange-400" },
  ];

  return (
    <div className="theme-neon-blue">
      <Layout>
        <div className="space-y-8 pb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase border-l-4 border-primary pl-4">REPORTS</h1>
            <div className="flex gap-3">
              <div className="flex gap-1 bg-card/50 p-1 rounded-2xl border border-primary/10">
                {['Today', 'Week', 'Month', 'Custom'].map((r) => (
                  <Button
                    key={r}
                    variant={dateRange === r ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setDateRange(r)}
                    className={`rounded-xl px-4 font-bold tracking-tight ${dateRange === r ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'text-muted-foreground'}`}
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <Button variant="outline" className="border-primary/10 hover:bg-primary/5 rounded-2xl gap-2 font-bold tracking-tight">
                <Calendar className="w-4 h-4 text-primary" /> MAR 2024
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-black/40 border border-primary/10">
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 rounded-lg">{kpi.trend}</Badge>
                </div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black opacity-60">{kpi.title}</p>
                <h3 className="text-3xl font-black mt-2 tracking-tight">{kpi.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-[3rem] bg-card/30 backdrop-blur-xl border border-primary/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" /> REVENUE TREND
                </h3>
                <Badge variant="outline" className="border-primary/10 text-muted-foreground">LAST 30 DAYS</Badge>
              </div>
              <div className="h-[300px]">
                <SalesChart />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="p-8 rounded-[3rem] bg-card/30 backdrop-blur-xl border border-primary/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" /> TOP PRODUCTS
                </h3>
                <Badge variant="outline" className="border-primary/10 text-muted-foreground">UNIT SALES</Badge>
              </div>
              <div className="h-[300px]">
                <TopProductsChart />
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-1 p-8 rounded-[3rem] bg-card/30 backdrop-blur-xl border border-primary/10"
            >
              <div className="mb-8">
                <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
                  <PieChart className="w-5 h-5 text-blue-400" /> PAYMENT METHODS
                </h3>
              </div>
              <div className="h-[300px]">
                <CategoryChart />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-primary/5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">Cash: 42%</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-primary/5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">UPI: 38%</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-2 p-10 rounded-[3.5rem] bg-primary/[0.03] backdrop-blur-3xl border border-primary/20 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />

              <div className="space-y-2 relative">
                <h3 className="text-4xl font-black tracking-tighter">DATA EXPORTS</h3>
                <p className="text-muted-foreground text-sm font-medium tracking-tight">Generate high-fidelity reports in multiple formats</p>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full max-w-xl relative">
                <Button
                  variant="outline"
                  className="h-32 flex flex-col gap-3 rounded-[2rem] border-primary/10 bg-black/40 hover:bg-primary/20 hover:border-primary/50 transition-all font-black tracking-widest text-[10px] uppercase shadow-inner"
                  onClick={() => handleExport('PDF')}
                >
                  <FileText className="w-8 h-8 text-red-400" />
                  <span>PDF REPORT</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex flex-col gap-3 rounded-[2rem] border-primary/10 bg-black/40 hover:bg-primary/20 hover:border-primary/50 transition-all font-black tracking-widest text-[10px] uppercase shadow-inner"
                  onClick={() => handleExport('EXCEL')}
                >
                  <FileSpreadsheet className="w-8 h-8 text-green-400" />
                  <span>EXCEL SHEET</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex flex-col gap-3 rounded-[2rem] border-primary/10 bg-black/40 hover:bg-primary/20 hover:border-primary/50 transition-all font-black tracking-widest text-[10px] uppercase shadow-inner"
                  onClick={() => handleExport('CSV')}
                >
                  <FileJson className="w-8 h-8 text-blue-400" />
                  <span>CSV DATA</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
