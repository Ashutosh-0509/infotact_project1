import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Package, 
  ArrowUpRight, 
  Cpu,
  Sparkles,
  BarChart3,
  Search,
  Filter,
  RefreshCcw,
  Bot
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 450000, orders: 1200 },
  { name: 'Feb', revenue: 520000, orders: 1400 },
  { name: 'Mar', revenue: 610000, orders: 1800 },
  { name: 'Apr', revenue: 580000, orders: 1600 },
  { name: 'May', revenue: 720000, orders: 2100 },
  { name: 'Jun', revenue: 850000, orders: 2500 },
];

const PREDICTION_DATA = [
  ...REVENUE_DATA,
  { name: 'Jul', revenue: 980000, isPrediction: true },
  { name: 'Aug', revenue: 1150000, isPrediction: true },
  { name: 'Sep', revenue: 1080000, isPrediction: true },
];

export default function AIPredictions() {
  const handleRegenerate = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'AI is recalculating business models...',
      success: 'Predictions updated with latest real-time data!',
      error: 'Failed to sync with AI engine.',
    });
  };

  return (
    <div className="theme-neon-blue min-h-screen">
      <Layout>
        <div className="space-y-10 pb-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl neon-blue-glow">
                   <Bot className="w-6 h-6 text-primary neon-blue-text-glow" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">PREDICTIVE INTELLIGENCE</h1>
              </div>
              <p className="text-muted-foreground font-medium ml-12">Next-gen machine learning engine optimizing your retail performance.</p>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" className="border-primary/20 hover:bg-primary/10 rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-xs gap-2">
                  <Filter className="w-4 h-4" /> Filter Data
               </Button>
               <Button onClick={handleRegenerate} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-xs gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                  <RefreshCcw className="w-4 h-4" /> Sync AI Engine
               </Button>
            </div>
          </div>

          {/* AI Banner */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-primary/20 p-10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10">
               <Sparkles className="w-64 h-64 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
               <div className="lg:w-1/2 space-y-6">
                  <Badge className="bg-primary text-white font-black px-4 py-1 text-xs rounded-full neon-blue-glow">CORE AI ACTIVE</Badge>
                  <h2 className="text-5xl font-black leading-[0.9] tracking-tighter uppercase italic">
                    The Future of <br /> 
                    <span className="text-primary neon-blue-text-glow">Your Business</span> <br />
                    Is Calculated.
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium max-w-md leading-relaxed">
                    Our proprietary neural networks have analyzed 12.5M data points. 
                    Your inventory strategy is currently 94.2% optimized for the upcoming quarter.
                  </p>
                  <div className="flex gap-8 pt-4">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Model Confidence</p>
                        <p className="text-3xl font-black text-primary italic">98.4%</p>
                     </div>
                     <div className="w-px h-12 bg-primary/10" />
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Processing Node</p>
                        <p className="text-3xl font-black text-primary italic">GPU-X12</p>
                     </div>
                  </div>
               </div>
               <div className="lg:w-1/2 w-full h-[300px] bg-primary/5 rounded-[2.5rem] border border-primary/10 p-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PREDICTION_DATA}>
                      <defs>
                        <linearGradient id="neonBlueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                      <XAxis dataKey="name" stroke="rgba(var(--primary),0.2)" fontSize={11} fontWeight="black" />
                      <YAxis hide />
                      <Tooltip 
                         contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid var(--primary)', borderRadius: '16px' }}
                         itemStyle={{ color: 'var(--primary)', fontWeight: 'black' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#neonBlueGradient)" strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forecast Card */}
            <Card className="lg:col-span-2 bg-black/30 backdrop-blur-2xl border-primary/10 rounded-[2.5rem] overflow-hidden">
               <CardHeader className="p-8 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-black tracking-tighter uppercase italic">Revenue Forecast Matrix</CardTitle>
                      <CardDescription className="font-bold text-primary/60">Predictive growth analysis based on historical cycles</CardDescription>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-muted-foreground uppercase">Projected Q3 Growth</p>
                       <p className="text-3xl font-black text-green-400 italic">+24.8%</p>
                    </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PREDICTION_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                      <XAxis dataKey="name" fontSize={11} fontWeight="black" stroke="rgba(var(--primary),0.2)" />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(var(--primary),0.2)', borderRadius: '12px' }}
                        itemStyle={{ fontWeight: 'black', fontSize: '12px' }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={5} dot={{ r: 6, fill: 'var(--primary)', strokeWidth: 2, stroke: '#000' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={5} strokeDasharray="8 8" data={PREDICTION_DATA.slice(-4)} />
                    </LineChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>

            {/* Smart Suggestions */}
            <div className="space-y-8">
               <Card className="bg-primary hover:bg-primary/95 transition-all text-primary-foreground border-none rounded-[2.5rem] overflow-hidden neon-blue-glow cursor-pointer">
                  <CardContent className="p-8">
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/20 rounded-2xl"><Zap className="w-8 h-8 fill-white" /></div>
                        <Badge className="bg-white/20 text-white font-black">HIGH IMPACT</Badge>
                     </div>
                     <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-3">Optimize Dairy <br /> Stock Now</h3>
                     <p className="font-bold opacity-80 text-sm leading-relaxed mb-6">
                        AI predicts a 34% surge in Amul Butter demand due to upcoming local festivals. Increase stock by 150 units.
                     </p>
                     <Button className="w-full bg-white text-primary font-black rounded-xl h-14 uppercase tracking-tighter">EXECUTE ADJUSTMENT</Button>
                  </CardContent>
               </Card>

               <Card className="bg-black/30 backdrop-blur-2xl border-primary/10 rounded-[2.5rem] p-8 space-y-6">
                  <h4 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                     <Cpu className="w-5 h-5 text-primary" /> Anomalies Detected
                  </h4>
                  <div className="space-y-4">
                     {[
                       { title: "Price Elasticity", msg: "Beverages are underpriced by 5%", type: "warning" },
                       { title: "Churn Risk", msg: "3 top customers haven't visited", type: "error" },
                       { title: "Margin Ops", msg: "Switch to Supplier B for SKU-10", type: "success" }
                     ].map((alert, i) => (
                       <div key={i} className="flex gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/5 hover:border-primary/20 transition-all cursor-pointer">
                          <div className={`w-1.5 h-full rounded-full ${alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-green-500'}`} />
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{alert.title}</p>
                             <p className="font-bold text-sm tracking-tight">{alert.msg}</p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 ml-auto text-primary/40" />
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
