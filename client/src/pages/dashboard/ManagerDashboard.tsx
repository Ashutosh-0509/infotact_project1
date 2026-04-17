import { useState, useMemo } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  Tags, 
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Edit,
  Trash2,
  FileText,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  X
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MOCK_PRODUCTS, 
  MOCK_CUSTOMERS, 
  MOCK_EMPLOYEES, 
  MOCK_SUPPLIERS,
  CATEGORIES 
} from "@/mockData";
import { formatCurrency } from "@/lib/index";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "suppliers", label: "Suppliers", icon: Truck },
  { id: "employees", label: "Employees", icon: Users },
  { id: "reports", label: "Sales Reports", icon: BarChart3 },
  { id: "promotions", label: "Promotions", icon: Tags },
  { id: "alerts", label: "Low Stock Alerts", icon: AlertTriangle },
];

const STOCK_CHART_DATA = MOCK_PRODUCTS.slice(0, 10).map(p => ({
  name: p.name?.split(' ')[0],
  stock: p.stock
}));

const SALES_CHART_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const MOCK_ALERTS = [
  { id: 1, name: "Amul Butter", stock: 3, min: 20, status: "CRITICAL", deficit: 17, deficitCost: 850 },
  { id: 2, name: "Dettol 200ml", stock: 8, min: 15, status: "LOW", deficit: 7, deficitCost: 700 },
  { id: 3, name: "Bisleri 1L", stock: 12, min: 25, status: "LOW", deficit: 13, deficitCost: 260 },
  { id: 4, name: "Boat Earphones", stock: 2, min: 10, status: "CRITICAL", deficit: 8, deficitCost: 6400 },
];

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [alertFilter, setAlertFilter] = useState("All");

  return (
    <SidebarLayout 
      role="Manager" 
      navItems={NAV_ITEMS} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Products", value: "247", icon: Package, color: "text-blue-600" },
              { label: "Low Stock Items", value: "18", icon: AlertTriangle, color: "text-amber-600" },
              { label: "Today's Sales", value: "₹45,230", icon: BarChart3, color: "text-green-600", trend: "+12.5%" },
              { label: "Pending Orders", value: "7", icon: Clock, color: "text-purple-600" },
            ].map((kpi, idx) => (
              <Card key={idx} className="border-none shadow-md overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">
                        {kpi.label}
                      </p>
                      <h3 className="text-3xl font-black">{kpi.value}</h3>
                      {kpi.trend && (
                        <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" /> {kpi.trend} vs yesterday
                        </p>
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors`}>
                      <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Stock Chart */}
             <Card className="lg:col-span-2 border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-black">Stock Levels (Top Products)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STOCK_CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={10} fontWeight="bold" />
                      <YAxis fontSize={10} fontWeight="bold" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="stock" fill="oklch(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
             </Card>

             {/* Low Stock List */}
             <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Low Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {MOCK_PRODUCTS.filter(p => p.stock < 50).slice(0, 5).map(p => (
                    <div key={p.sku} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                      <div>
                        <p className="text-sm font-bold truncate max-w-[140px]">{p.name}</p>
                        <p className="text-[10px] font-black text-amber-600">{p.stock} units remaining</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold border-amber-600/20 hover:bg-amber-600/10 text-amber-600">REORDER</Button>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-xs font-bold text-primary">View All Alerts</Button>
                </CardContent>
             </Card>
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
             <div>
               <h1 className="text-3xl font-black tracking-tighter">Product Inventory</h1>
               <p className="text-muted-foreground text-sm">Manage your store products and stock.</p>
             </div>
             <Button className="rounded-xl gap-2 font-black h-12 px-6">
               <Plus className="w-5 h-5" /> ADD NEW PRODUCT
             </Button>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <Card className="border-none shadow-sm bg-green-50/50">
               <CardContent className="p-4 py-3 flex items-center gap-3">
                 <div className="p-2 bg-green-600 rounded-lg"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                 <div><p className="text-[10px] font-black text-green-800 uppercase">In Stock</p><p className="text-lg font-black">214</p></div>
               </CardContent>
             </Card>
             <Card className="border-none shadow-sm bg-amber-50/50">
               <CardContent className="p-4 py-3 flex items-center gap-3">
                 <div className="p-2 bg-amber-600 rounded-lg"><AlertTriangle className="w-4 h-4 text-white" /></div>
                 <div><p className="text-[10px] font-black text-amber-800 uppercase">Low Stock</p><p className="text-lg font-black">18</p></div>
               </CardContent>
             </Card>
             <Card className="border-none shadow-sm bg-red-50/50">
               <CardContent className="p-4 py-3 flex items-center gap-3">
                 <div className="p-2 bg-red-600 rounded-lg"><X className="w-4 h-4 text-white" /></div>
                 <div><p className="text-[10px] font-black text-red-800 uppercase">Out of Stock</p><p className="text-lg font-black">15</p></div>
               </CardContent>
             </Card>
             <Card className="border-none shadow-sm">
               <CardContent className="p-4 py-3 flex items-center gap-3">
                 <div className="p-2 bg-primary rounded-lg"><Package className="w-4 h-4 text-white" /></div>
                 <div><p className="text-[10px] font-black text-primary uppercase">Total Scale</p><p className="text-lg font-black">₹4.2M</p></div>
               </CardContent>
             </Card>
          </div>

          <Card className="border-none shadow-md overflow-hidden">
            <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between bg-card/100">
               <div className="relative flex-1 group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <Input placeholder="Search by name, SKU or barcode..." className="pl-10 h-10 border-none bg-muted/50 rounded-lg" />
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" className="gap-2 rounded-lg font-bold"><Filter className="w-4 h-4" /> Filters</Button>
                 <Button variant="outline" className="gap-2 rounded-lg font-bold"><FileText className="w-4 h-4" /> Export</Button>
               </div>
            </div>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px]"># SKU</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Product Name</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Category</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Stock</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Price</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Status</TableHead>
                  <TableHead className="text-right font-black uppercase text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PRODUCTS.map((p) => (
                  <TableRow key={p.sku} className="hover:bg-muted/10 transition-colors group">
                    <TableCell className="font-mono text-[10px] font-black opacity-60">{p.sku}</TableCell>
                    <TableCell className="font-bold text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-black text-[10px]">{p.name?.[0]}</div>
                        {p.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-black uppercase">{p.categoryId}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{p.stock}</span>
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${p.stock < 50 ? 'bg-amber-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(100, (p.stock || 0) / 2)}%` }} 
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-black">₹{p.price}</TableCell>
                    <TableCell>
                       {p.stock && p.stock > 50 ? (
                         <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 border-none">Active</Badge>
                       ) : (
                         <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 px-3 border-none">Low Stock</Badge>
                       )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Edit className="w-4 h-4" /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 bg-muted/10 flex justify-between items-center">
              <p className="text-xs text-muted-foreground font-bold uppercase">Showing 10 of 247 products</p>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                <Button size="icon" variant="outline" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "employees" && (
        <div className="space-y-6">
           <div className="flex justify-between items-end">
             <div>
               <h1 className="text-3xl font-black tracking-tighter">Team Members</h1>
               <p className="text-muted-foreground text-sm">Monitor attendance and manage store staff.</p>
             </div>
             <Button className="rounded-xl gap-2 font-black h-12 px-6">
               <UserCheck className="w-5 h-5" /> MARK ATTENDANCE
             </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_EMPLOYEES.map(emp => (
              <Card key={emp.name} className="border-none shadow-md overflow-hidden group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                   <div className="relative mb-4">
                     <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-2xl text-primary border-2 border-primary/20 transition-all group-hover:bg-primary group-hover:text-white group-hover:-rotate-3">
                       {emp.name?.[0]}{emp.name?.split(' ')[1]?.[0]}
                     </div>
                     <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                   </div>
                   <h3 className="font-black text-lg">{emp.name}</h3>
                   <div className="flex gap-2 mt-2">
                     <Badge variant="outline" className="text-[10px] font-black uppercase text-muted-foreground">{emp.role}</Badge>
                     <Badge className="text-[10px] font-black uppercase bg-muted text-foreground border-none">Present</Badge>
                   </div>
                   <div className="mt-4 pt-4 border-t w-full space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground">CHECK-IN</span>
                        <span>09:24 AM</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground">HOURS</span>
                        <span className="text-primary">6h 15m</span>
                      </div>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-black">Today's Attendance Log</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px]">Employee</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Status</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Check In</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Check Out</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_EMPLOYEES.map((emp, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-bold">{emp.name}</TableCell>
                    <TableCell>
                       <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 font-black">Present</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">09:{20 + i} AM</TableCell>
                    <TableCell className="font-mono text-xs">--</TableCell>
                    <TableCell className="font-bold text-xs">{7 - i}h 12m</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Low Stock Alerts Tab */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
             <div>
               <h1 className="text-3xl font-black tracking-tighter">Low Stock Alerts</h1>
               <p className="text-muted-foreground text-sm">Monitor products requiring immediate restock.</p>
             </div>
             <Button className="rounded-xl gap-2 font-black h-12 px-6">
               <FileText className="w-5 h-5" /> EXPORT REPORT
             </Button>
          </div>

          {/* Summary Card */}
          <Card className="border-none shadow-md overflow-hidden bg-primary/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2">Critical</p>
                  <p className="text-4xl font-black text-red-600">2</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2">Low</p>
                  <p className="text-4xl font-black text-amber-600">2</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-2">Total Deficit</p>
                  <p className="text-4xl font-black text-primary">₹8,210</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {["All", "Critical (<5)", "Low (5-20)"].map(filter => (
              <Button 
                key={filter}
                variant={alertFilter === filter ? "default" : "secondary"}
                className={`rounded-full px-6 font-bold ${
                  alertFilter === filter 
                    ? '' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setAlertFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Alert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_ALERTS.filter(alert => {
              if (alertFilter === "Critical (<5)") return alert.status === "CRITICAL";
              if (alertFilter === "Low (5-20)") return alert.status === "LOW";
              return true;
            }).map((alert) => (
              <Card key={alert.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={alert.status === "CRITICAL" ? "destructive" : "default"} className={alert.status === "LOW" ? "bg-amber-500 hover:bg-amber-600" : ""}>
                      {alert.status}
                    </Badge>
                    <AlertTriangle className={`w-5 h-5 ${alert.status === "CRITICAL" ? "text-red-500" : "text-amber-500"}`} />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-4 line-clamp-1">{alert.name}</h3>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Current Stock</span>
                      <span className="font-black text-red-600 text-base">{alert.stock}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Min Required</span>
                      <span className="font-bold">{alert.min}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t">
                      <span className="text-muted-foreground font-medium">Deficit</span>
                      <span className="font-black text-primary">-{alert.deficit} units</span>
                    </div>
                  </div>

                  <Button className="w-full font-bold gap-2 group mt-auto">
                    CREATE PO
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for other tabs to keep code short but functional */}
      {["suppliers", "reports", "promotions"].includes(activeTab) && (
        <div className="h-[400px] flex flex-col items-center justify-center space-y-4 bg-card/40 rounded-3xl border-2 border-dashed border-primary/10">
           <div className="p-6 bg-primary/10 rounded-full">
             <LayoutDashboard className="w-12 h-12 text-primary" />
           </div>
           <h2 className="text-2xl font-black">{activeTab.toUpperCase()} Section</h2>
           <p className="text-muted-foreground font-bold">Comprehensive management interface for {activeTab}.</p>
           <Button className="rounded-xl font-black">INITIALIZE MODULE</Button>
        </div>
      )}
    </SidebarLayout>
  );
};

export default ManagerDashboard;
