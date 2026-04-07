import React from 'react';
import { ShoppingCart, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTE_PATHS.HOME)}>
            <div className="bg-[#1e293b] p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1e293b]">POS Pro</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#analytics" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Analytics</a>
            <a href="#inventory" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Inventory</a>
            <a href="#pos" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">POS</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate(ROUTE_PATHS.LOGIN)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate(ROUTE_PATHS.LOGIN)}
              className="bg-[#1e293b] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
