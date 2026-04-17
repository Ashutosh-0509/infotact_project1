import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogIn, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Simple scroll spy logic
      const sections = ['features', 'analytics', 'inventory', 'pos'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveTab(section);
            return;
          }
        }
      }
      if (window.scrollY < 100) setActiveTab('');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'Analytics', id: 'analytics' },
    { name: 'Inventory', id: 'inventory' },
    { name: 'POS', id: 'pos' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate(ROUTE_PATHS.HOME)}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <span className={`text-xl font-extrabold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>Retail Pro</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 bg-slate-900/5 backdrop-blur-md px-2 py-1 rounded-full border border-slate-200/50">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === link.id 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => navigate(ROUTE_PATHS.LOGIN)}
                className={`text-sm font-bold transition-colors ${scrolled ? 'text-slate-700 hover:text-blue-600' : 'text-slate-200 hover:text-white'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate(ROUTE_PATHS.SIGNUP)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:scale-95"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(true)} className={`p-2 rounded-lg ${scrolled ? 'text-slate-800' : 'text-white'}`}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-[70] flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-100">
                <span className="text-xl font-extrabold text-slate-900">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="text-left text-lg font-semibold text-slate-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
              <div className="p-6 border-t border-slate-100 flex flex-col gap-3">
                <button onClick={() => navigate(ROUTE_PATHS.LOGIN)} className="w-full py-3 rounded-xl text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 transition-colors">
                  Sign In
                </button>
                <button onClick={() => navigate(ROUTE_PATHS.SIGNUP)} className="w-full py-3 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                  Get Started
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
