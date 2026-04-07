import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-8">
        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
        v2.0 is now live
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#1e293b] mb-6">
        Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#1e293b]">Retail Management</span>
      </h1>
      
      <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
        A unified platform for cashiers, managers, and administrators to streamline retail operations and boost business growth.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onClick={() => navigate(ROUTE_PATHS.LOGIN)}
          className="bg-[#0f172a] text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
        >
          Access POS System
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
