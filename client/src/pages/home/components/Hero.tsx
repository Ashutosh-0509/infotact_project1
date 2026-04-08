import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { ArrowRight, BarChart3, ShoppingBag } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export const Hero = () => {
  const navigate = useNavigate();

  // 3D Parallax effect state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950 min-h-screen flex flex-col justify-center perspective-[1200px]"
    >
      {/* Refined Glowing Background Elements */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/40 border border-slate-700/50 text-slate-300 text-sm font-medium mb-8 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></span>
            v2.0 is now live
          </div>
          
          <h1 
            style={{ fontFamily: "'Outfit', sans-serif" }} 
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white mb-6 max-w-5xl leading-[1.1] drop-shadow-lg"
          >
            Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-indigo-300">Retail Management</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            A unified, intelligent platform for cashiers, managers, and administrators to streamline operations and accelerate growth.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button 
              onClick={() => navigate(ROUTE_PATHS.LOGIN)}
              className="group relative bg-white text-slate-900 px-10 py-4 rounded-full text-lg font-extrabold transition-all flex items-center gap-3 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 hover:bg-slate-50 border-2 border-transparent hover:border-white/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative z-10">Access POS System</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform text-blue-600" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-white px-10 py-4 rounded-full text-lg font-bold bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Explore Features
            </button>
          </div>
        </motion.div>

        {/* Floating 3D Mockup Elements */}
        <div className="mt-20 relative max-w-5xl mx-auto hidden md:block h-72 lg:h-96 w-full">
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-4xl aspect-[16/9] shadow-2xl rounded-2xl z-10"
          >
            <img 
              style={{ transform: "translateZ(30px)" }}
              src="/assets/hero_dashboard.png" 
              alt="POS Dashboard Mockup" 
              className="w-full h-full object-cover rounded-2xl border border-slate-700/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]" 
            />

            <motion.div
              style={{ transform: "translateZ(60px)" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-10 top-16 bg-slate-800/90 border border-slate-600/50 p-4 rounded-xl shadow-2xl flex items-center gap-4 backdrop-blur-md"
            >
              <div className="p-2.5 bg-emerald-500/20 rounded-lg text-emerald-400"><ShoppingBag className="w-5 h-5"/></div>
              <div className="text-left">
                <div className="text-xs text-slate-400 font-medium">Total Sales</div>
                <div className="text-lg font-bold text-white">$12,450</div>
              </div>
            </motion.div>

            <motion.div
               style={{ transform: "translateZ(80px)" }}
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -right-6 top-32 bg-slate-800/90 border border-slate-600/50 p-4 rounded-xl shadow-2xl flex items-center gap-4 backdrop-blur-md"
            >
               <div className="p-2.5 bg-blue-500/20 rounded-lg text-blue-400"><BarChart3 className="w-5 h-5"/></div>
               <div className="text-left">
                 <div className="text-xs text-slate-400 font-medium">Conversion</div>
                 <div className="text-lg font-bold text-white">+24.5%</div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
