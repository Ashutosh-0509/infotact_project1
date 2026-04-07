import React from 'react';

export const StatsSection = () => {
  const stats = [
    { label: 'ACTIVE STORES', value: '12,000+' },
    { label: 'DAILY TRANSACTIONS', value: '850K+' },
    { label: 'GLOBAL PARTNERS', value: '45' },
    { label: 'CUSTOMER SATISFACTION', value: '99%' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-extrabold text-[#1e293b] mb-2">{stat.value}</div>
              <div className="text-sm font-semibold tracking-wider text-gray-500 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating Chat Icon Mockup */}
      <div className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    </section>
  );
};
