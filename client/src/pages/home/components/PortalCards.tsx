import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { Calculator, Users, Settings, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const PortalCards = () => {
  const navigate = useNavigate();

  const portals = [
    {
      title: 'Cashier Portal',
      description: 'Process sales, handle returns, and manage daily transactions directly from the POS interface.',
      icon: <Calculator className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-500/10',
      hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
      borderGlow: 'group-hover:border-blue-400/50',
      loginPath: '/login/cashier',
    },
    {
      title: 'Manager Portal',
      description: 'Track inventory, analyze sales trends, and monitor employee performance in real-time.',
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      color: 'bg-indigo-500/10',
      hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]',
      borderGlow: 'group-hover:border-indigo-400/50',
      loginPath: '/login/manager',
    },
    {
      title: 'Administration',
      description: 'Configure store settings, manage roles, and execute full system oversight.',
      icon: <Settings className="w-8 h-8 text-purple-500" />,
      color: 'bg-purple-500/10',
      hoverGlow: 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
      borderGlow: 'group-hover:border-purple-400/50',
      loginPath: '/login/admin',
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden text-center">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Dedicated Role Portals</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Secure, specialized environments tailored for every member of your retail team.</p>
        </motion.div>

        <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={containerVariants}
        >
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 text-left"
          >
            {portals.map((portal) => (
              <motion.div 
                variants={itemVariants}
                key={portal.title}
                className={`bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/20 border border-slate-800 transition-all duration-300 group cursor-pointer flex flex-col h-full hover:-translate-y-2 ${portal.hoverGlow} ${portal.borderGlow}`}
                onClick={() => navigate(portal.loginPath)}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${portal.color}`}>
                  {portal.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{portal.title}</h3>
                <p className="text-slate-400 mb-8 flex-grow leading-relaxed text-lg">
                  {portal.description}
                </p>
                <div className="flex items-center text-white font-bold group-hover:text-blue-400 transition-colors">
                  Access Portal <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
