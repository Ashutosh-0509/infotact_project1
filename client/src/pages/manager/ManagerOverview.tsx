import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, BarChart3, Clock, ArrowUpRight } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { MOCK_PRODUCTS } from "@/mockData";
import { Link } from "react-router-dom";

const STOCK_CHART_DATA = MOCK_PRODUCTS.slice(0, 10).map(p => ({
  name: p.name?.split(' ')[0] || p.name,
  stock: p.stock
}));

export const ManagerOverview = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: "247", icon: Package, color: "text-[#1a8a3c]", bg: "bg-[#1a8a3c]/10" },
          { label: "Low Stock Items", value: "18", icon: AlertTriangle, color: "text-[#e67e00]", bg: "bg-[#e67e00]/10" },
          { label: "Today's Sales", value: "₹45,230", icon: BarChart3, color: "text-[#1a8a3c]", bg: "bg-[#1a8a3c]/10", trend: "+12.5%" },
          { label: "Pending Orders", value: "7", icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {kpi.label}
                  </p>
                  <h3 className="text-3xl font-black">{kpi.value}</h3>
                  {kpi.trend && (
                    <p className="text-[10px] font-bold text-[#1a8a3c] mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> {kpi.trend} vs yesterday
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-2xl ${kpi.bg} transition-colors`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Stock Chart */}
         <Card className="lg:col-span-2 border-none shadow-sm">
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
                    cursor={{fill: '#f1f5f9'}}
                  />
                  <Bar dataKey="stock" fill="#1a8a3c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Low Stock List */}
         <Card className="border-none shadow-sm flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#e67e00]" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              {MOCK_PRODUCTS.filter(p => (p.stock || 0) < 50).slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                  <div>
                    <p className="text-sm font-bold truncate max-w-[140px]">{p.name}</p>
                    <p className="text-[10px] font-black text-[#e67e00]">{p.stock} units remaining</p>
                  </div>
                </div>
              ))}
              <div className="mt-auto pt-4 text-center">
                <Link to="/manager/alerts">
                  <Button variant="ghost" className="w-full text-xs font-bold text-[#1a8a3c] hover:text-[#1a8a3c] hover:bg-[#1a8a3c]/10">View All Alerts →</Button>
                </Link>
              </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default ManagerOverview;
