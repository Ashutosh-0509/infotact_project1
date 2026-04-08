import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState<number | string>(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
      if (!numericValue) {
        setCount(value);
        return;
      }
      
      const incrementTime = (duration / numericValue) * 1000;
      const timer = setInterval(() => {
        start += Math.ceil(numericValue / (duration * 60));
        if (start >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [value, duration, isInView]);

  const suffix = value.replace(/[0-9]/g, '');
  
  return <span ref={ref}>{typeof count === 'number' ? count.toLocaleString() : count}{suffix}</span>;
};

export const StatsSection = () => {
  const stats = [
    { label: 'Active Stores', value: '12000+', color: 'text-blue-600' },
    { label: 'Daily Transactions', value: '850K+', color: 'text-indigo-600' },
    { label: 'Global Partners', value: '45', color: 'text-emerald-600' },
    { label: 'Satisfaction', value: '99%', color: 'text-amber-500' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-900/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-indigo-900/20 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Actionable Analytics</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Make data-driven decisions with real-time insights, custom reports, and predictive sales forecasting.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800 ring-1 ring-white/5 mb-16"
        >
          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <div className="font-semibold text-lg text-white">Revenue Overview</div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-700"></span>
              <span className="w-3 h-3 rounded-full bg-slate-700"></span>
              <span className="w-3 h-3 rounded-full bg-slate-700"></span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative h-64 flex items-end gap-3 px-4 border-b border-slate-800 pb-2">
              {/* Background Grid Lines */}
              <div className="absolute inset-x-4 bottom-2 top-0 flex flex-col justify-between pt-4 pb-0 z-0">
                 {[1, 2, 3, 4, 5].map(line => <div key={line} className="w-full h-px bg-slate-800/50"></div>)}
              </div>
              
              {/* CSS Bar Chart */}
              {[40, 70, 45, 90, 65, 85, 100, 60, 75, 45].map((height, i) => (
                <div key={i} className="flex-1 h-full flex flex-col justify-end group z-10 relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.05, type: "spring", stiffness: 50 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400 shadow-md relative group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-t-lg transition-opacity duration-300"></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white text-xs py-1.5 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl font-medium z-50">
                      ${(height * 1.2).toFixed(1)}k
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors"
              >
                <div className="text-sm text-blue-400 font-medium mb-1">Total Sales</div>
                <div className="text-3xl font-bold text-white">$2.4M</div>
                <div className="text-xs text-emerald-400 mt-2 flex items-center font-medium">
                  ↑ 14.5% vs last month
                </div>
              </motion.div>
              <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: 0.4 }}
                 className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors"
              >
                <div className="text-sm text-emerald-400 font-medium mb-1">Profit Margin</div>
                <div className="text-3xl font-bold text-white">24.2%</div>
                <div className="text-xs text-emerald-400 mt-2 flex items-center font-medium">
                  ↑ 2.1% vs last month
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors"
              >
                <div className="text-sm text-amber-400 font-medium mb-1">Avg Order Value</div>
                <div className="text-3xl font-bold text-white">$84.50</div>
                <div className="text-xs text-emerald-400 mt-2 flex items-center font-medium">
                  ↑ $4.20 vs last month
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Global Stats with Animated Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-slate-800 pt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group border-r last:border-0 border-slate-800 mt-4 lg:mt-0 px-4">
              <div className={`text-4xl lg:text-5xl font-extrabold mb-3 tracking-tight ${stat.color} drop-shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-sm font-bold tracking-widest text-slate-500 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating Chat Icon Mockup */}
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full shadow-xl shadow-blue-500/30 flex items-center justify-center cursor-pointer z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </motion.div>
    </section>
  );
};
