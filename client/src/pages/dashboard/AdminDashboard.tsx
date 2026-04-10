import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "@/components/SidebarLayout";
import { 
  BarChart3, 
  Store, 
  Users, 
  Wallet, 
  Brain, 
  History, 
  Settings, 
  Download,
  TrendingUp,
  ShoppingBag,
  Package,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  FileText,
  BadgeAlert,
  MapPin,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Monitor
} from "lucide-react";
import {
  MOCK_EMPLOYEES,
  MOCK_SUPPLIERS
} from "@/mockData";
import { ROUTE_PATHS } from "@/lib/index";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "stores", label: "Stores", icon: Store },
  { id: "users", label: "Users & Roles", icon: Users },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "ai", label: "AI Predictions", icon: Brain },
  { id: "retail-pro", label: "Retail Pro Platform", icon: Monitor },
  { id: "audit", label: "Audit Logs", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "export", label: "Export Reports", icon: Download },
];

const REVENUE_DATA = [
  { name: 'Jan', revenue: 450000, orders: 1200 },
  { name: 'Feb', revenue: 520000, orders: 1400 },
  { name: 'Mar', revenue: 610000, orders: 1800 },
  { name: 'Apr', revenue: 580000, orders: 1600 },
  { name: 'May', revenue: 720000, orders: 2100 },
  { name: 'Jun', revenue: 850000, orders: 2500 },
];

const CATEGORY_DATA = [
  { name: 'Food', value: 45 },
  { name: 'Beverages', value: 20 },
  { name: 'Electronics', value: 15 },
  { name: 'Personal Care', value: 20 },
];

const COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe'];

const ADMIN_KPIS = [
  { label: "Total Revenue", value: "₹12,45,670", trend: "+18.5%", icon: Wallet },
  { label: "Total Orders", value: "3,847", trend: "+12.3%", icon: ShoppingBag },
  { label: "Active Products", value: "247", trend: "+5 new", icon: Package },
  { label: "Total Customers", value: "1,204", trend: "+89 new", icon: Users },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    if (activeTab === "retail-pro") {
      navigate(ROUTE_PATHS.POS);
      // Reset tab so if they come back it's not stuck
      setActiveTab("analytics");
    }
  }, [activeTab, navigate]);
  const [liveActivities, setLiveActivities] = useState([
    { id: 1, text: "New order #1089 — ₹2,340 — Rajesh Kumar", time: "2 min ago", icon: ShoppingBag, color: "text-green-600" },
    { id: 2, text: "Low stock: Amul Butter — 3 units left", time: "5 min ago", icon: BadgeAlert, color: "text-amber-600" },
    { id: 3, text: "Payment ₹5,600 via UPI — Priya Sharma", time: "12 min ago", icon: Zap, color: "text-purple-600" },
    { id: 4, text: "Stock received: Parle-G — 500 units", time: "45 min ago", icon: Package, color: "text-blue-600" },
  ]);

  return (
    <SidebarLayout 
      role="Admin" 
      navItems={NAV_ITEMS} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {activeTab === "analytics" && (
        <div className="space-y-8">
           {/* KPI Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {ADMIN_KPIS.map((kpi, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
               >
                 <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/20 overflow-hidden relative group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <kpi.icon className="w-6 h-6" />
                        </div>
                        <Badge className="bg-green-500/10 text-green-500 border-none font-black text-[10px]">{kpi.trend}</Badge>
                      </div>
                      <p className="text-xs font-black text-muted-foreground uppercase mb-1">{kpi.label}</p>
                      <h3 className="text-2xl font-black tracking-tighter">{kpi.value}</h3>
                    </CardContent>
                    <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-175">
                      <kpi.icon className="w-24 h-24" />
                    </div>
                 </Card>
               </motion.div>
             ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Revenue Chart */}
              <Card className="lg:col-span-2 border-none shadow-xl bg-card">
                 <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                     <CardTitle className="text-xl font-black tracking-tighter">Revenue Analysis</CardTitle>
                     <CardDescription className="text-xs font-bold uppercase">Monthly performance overview</CardDescription>
                   </div>
                   <div className="flex bg-muted p-1 rounded-lg">
                     <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black px-3 rounded-md">DAILY</Button>
                     <Button variant="secondary" size="sm" className="h-7 text-[10px] font-black px-3 rounded-md shadow-sm">MONTHLY</Button>
                   </div>
                 </CardHeader>
                 <CardContent className="h-[350px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={REVENUE_DATA}>
                       <defs>
                         <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="name" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                       <YAxis fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                       <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                       <Tooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                       />
                       <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </CardContent>
              </Card>

              {/* Live Activity Feed */}
              <Card className="border-none shadow-xl bg-card overflow-hidden">
                 <CardHeader className="border-b bg-muted/5">
                    <CardTitle className="text-lg font-black flex items-center gap-2">
                       <Zap className="w-5 h-5 text-primary animate-pulse" />
                       Live Activity
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y overflow-y-auto max-h-[380px] custom-scrollbar">
                       {liveActivities.map((act) => (
                         <div key={act.id} className="p-4 flex gap-4 hover:bg-muted/30 transition-colors">
                           <div className={`mt-1 p-2 rounded-lg bg-card shadow-sm`}>
                             <act.icon className={`w-4 h-4 ${act.color}`} />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-xs font-bold leading-relaxed">{act.text}</p>
                             <div className="flex items-center gap-2 mt-1">
                               <Clock className="w-3 h-3 text-muted-foreground" />
                               <span className="text-[10px] font-black text-muted-foreground uppercase">{act.time}</span>
                             </div>
                           </div>
                         </div>
                       ))}
                    </div>
                    <Button variant="ghost" className="w-full h-12 rounded-none p-0 text-[10px] font-black uppercase text-primary border-t">
                       View Complete Audit Log
                    </Button>
                 </CardContent>
              </Card>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Sales by Category */}
              <Card className="border-none shadow-xl">
                 <CardHeader>
                   <CardTitle className="text-lg font-black">Sales by Category</CardTitle>
                 </CardHeader>
                 <CardContent className="h-[250px] flex flex-col items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={CATEGORY_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {CATEGORY_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                       {CATEGORY_DATA.map((c, i) => (
                         <div key={c.name} className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                           <span className="text-[10px] font-black text-muted-foreground uppercase">{c.name} {c.value}%</span>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              {/* Store Performance */}
              <Card className="lg:col-span-2 border-none shadow-xl">
                 <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle className="text-lg font-black">Store Performance</CardTitle>
                   <Button variant="outline" size="sm" className="h-8 text-[10px] font-black rounded-lg">ALL STORES</Button>
                 </CardHeader>
                 <CardContent>
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="font-black uppercase text-[10px]">Location</TableHead>
                          <TableHead className="font-black uppercase text-[10px]">Manager</TableHead>
                          <TableHead className="font-black uppercase text-[10px]">Today's Sales</TableHead>
                          <TableHead className="font-black uppercase text-[10px]">Orders</TableHead>
                          <TableHead className="text-right font-black uppercase text-[10px]">Growth</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { city: "Mumbai Central", mgr: "Rahul Singh", sales: "₹1,45,230", orders: 124, trend: "+12%" },
                          { city: "Pune FC Road", mgr: "Amit Desai", sales: "₹92,400", orders: 85, trend: "+8%" },
                          { city: "Delhi Connaught", mgr: "Priya Verma", sales: "₹1,12,000", orders: 102, trend: "-2%" },
                        ].map((s) => (
                          <TableRow key={s.city}>
                            <TableCell className="font-bold flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> {s.city}</TableCell>
                            <TableCell className="text-xs font-medium">{s.mgr}</TableCell>
                            <TableCell className="font-black">{s.sales}</TableCell>
                            <TableCell className="font-bold">{s.orders}</TableCell>
                            <TableCell className={`text-right font-black ${s.trend.startsWith('+') ? 'text-green-500' : 'text-destructive'}`}>
                               {s.trend}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </CardContent>
              </Card>
           </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="space-y-8">
           <div className="bg-primary/5 p-8 rounded-3xl border-2 border-primary/10 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                 <div className="p-6 bg-primary/10 rounded-full border-2 border-primary/20">
                    <Brain className="w-16 h-16 text-primary" />
                 </div>
                 <div className="text-center md:text-left">
                    <Badge className="bg-primary text-white font-black uppercase text-[10px] mb-2 px-3">Powered by Machine Learning</Badge>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">AI-Powered Business Intelligence</h1>
                    <p className="text-muted-foreground font-bold">Predicting trends, forecasting revenue, and optimizing stock automatically.</p>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Zap className="w-64 h-64 text-primary" />
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl border-t-4 border-t-orange-500">
                 <CardHeader>
                    <CardTitle className="text-xl font-black tracking-tighter">30-Day Revenue Forecast</CardTitle>
                    <CardDescription className="text-xs font-black text-orange-600 uppercase">Estimated Growth: ₹14,50,000 (+16.5%)</CardDescription>
                 </CardHeader>
                 <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={REVENUE_DATA.concat([{ name: 'Jul', revenue: 980000, orders: 2800 }])}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                          <XAxis dataKey="name" fontSize={11} fontWeight="bold" />
                          <YAxis fontSize={11} fontWeight="bold" hide />
                          <Tooltip />
                          <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={4} dot={{ r: 6, fill: '#7c3aed' }} />
                          <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={4} strokeDasharray="8 8" data={REVENUE_DATA.slice(-2).concat([{ name: 'Jul', revenue: 980000, orders: 2800 }])} />
                       </LineChart>
                    </ResponsiveContainer>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-xl">
                 <CardHeader>
                    <CardTitle className="text-xl font-black tracking-tighter">Smart Reorder Suggestions</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {[
                         { name: "Amul Butter 500g", current: 8, emptyIn: "3 days", suggest: 100 },
                         { name: "Parle-G 800g", current: 45, emptyIn: "7 days", suggest: 300 },
                         { name: "Tata Salt 1kg", current: 20, emptyIn: "4 days", suggest: 150 },
                       ].map((item) => (
                         <div key={item.name} className="p-4 bg-muted/40 rounded-2xl flex items-center justify-between border-2 border-transparent hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-card rounded-xl shadow-sm"><Package className="w-5 h-5 text-primary" /></div>
                               <div>
                                  <p className="text-sm font-black">{item.name}</p>
                                  <p className="text-[10px] font-black text-destructive uppercase">Run out in {item.emptyIn}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-black text-muted-foreground uppercase mb-1">Suggest Qty</p>
                               <Badge className="bg-primary hover:bg-primary font-black px-4">{item.suggest} Units</Badge>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      )}

      {/* Other tabs as placeholders */}
      {["stores", "users", "finance", "audit", "settings", "export"].includes(activeTab) && (
        <div className="h-[500px] flex flex-col items-center justify-center space-y-6 bg-card rounded-[40px] border-4 border-dashed border-primary/5 shadow-inner">
           <div className="p-8 bg-primary/5 rounded-full ring-4 ring-primary/5">
              {(() => {
                 const Icon = NAV_ITEMS.find(n => n.id === activeTab)?.icon;
                 return Icon ? <Icon className="w-16 h-16 text-primary" /> : null;
              })()}
           </div>
           <div className="text-center">
             <h2 className="text-4xl font-black tracking-tighter lowercase">{activeTab} section</h2>
             <p className="text-muted-foreground font-bold mt-2">Professional administration tools for {activeTab} management.</p>
           </div>
           <Button className="h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">INITIALIZE CONTROL PANEL</Button>
        </div>
      )}
    </SidebarLayout>
  );
};

export default AdminDashboard;
