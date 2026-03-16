import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { Calculator, Users, Settings, ArrowRight } from 'lucide-react';

export const PortalCards = () => {
  const navigate = useNavigate();

  const portals = [
    {
      title: 'Cashier Portal',
      description: 'Process sales, handle returns, and manage daily transactions directly from the POS interface.',
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50',
      loginPath: ROUTE_PATHS.LOGIN_CASHIER,
    },
    {
      title: 'Manager Portal',
      description: 'Track inventory, analyze sales trends, and monitor employee performance in real-time.',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50',
      loginPath: ROUTE_PATHS.LOGIN_MANAGER,
    },
    {
      title: 'Administration',
      description: 'Configure store settings, manage roles, and execute full system oversight.',
      icon: <Settings className="w-6 h-6 text-slate-600" />,
      color: 'bg-slate-100',
      loginPath: ROUTE_PATHS.LOGIN_ADMIN,
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1e293b] mb-4">Select Your Portal</h2>
          <p className="text-lg text-gray-500">Secure, dedicated environments for every member of your retail team.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {portals.map((portal) => (
            <div 
              key={portal.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
              onClick={() => navigate(portal.loginPath)}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${portal.color}`}>
                {portal.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{portal.title}</h3>
              <p className="text-gray-500 mb-8 flex-grow leading-relaxed">
                {portal.description}
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                Login <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
