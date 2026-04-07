import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortalCards } from './components/PortalCards';
import { StatsSection } from './components/StatsSection';
import { Footer } from './components/Footer';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <main>
        <Hero />
        <div id="features">
          <PortalCards />
        </div>
        <div id="analytics">
          <StatsSection />
        </div>
        
        <section id="inventory" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-white">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Inventory Management</h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Real-time stock tracking, automated reordering, and comprehensive catalog management across all your store locations.
              </p>
              
              <div className="space-y-8">
                {[ 
                  { step: '1', title: 'Stock Alerts', bg: 'bg-indigo-500/20', color: 'text-indigo-400', desc: 'Secure automatic low-stock alerts and generate purchase orders with a single click.' },
                  { step: '2', title: 'Multi-Location', bg: 'bg-emerald-500/20', color: 'text-emerald-400', desc: 'Transfer items seamlessly between branches and track stock in transit.' },
                  { step: '3', title: 'Barcode Mapping', bg: 'bg-amber-500/20', color: 'text-amber-400', desc: 'Instantly map physical products using advanced barcode scanning algorithms.' }
                ].map((item, idx) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                    className="flex gap-6 group"
                  >
                    <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center shrink-0 ${item.color} font-extrabold text-xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform`}>{item.step}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative perspective-[1000px] h-full"
            >
              <img src="/assets/inventory_dashboard.png" alt="Inventory Dashboard Mockup" className="w-full h-auto object-cover rounded-2xl shadow-[0_0_50px_-15px_rgba(255,255,255,0.1)] border border-slate-700/50 xl:scale-110 xl:origin-left" />
            </motion.div>
          </div>
        </section>

        <section id="pos" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className="order-2 lg:order-1"
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Advanced POS Experience</h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Lightning-fast checkout, offline capabilities, and seamless hardware integration to keep your lines moving.
                </p>
                <ul className="space-y-6">
                  {[ 
                    { title: 'Offline Mode', color: 'blue', desc: 'Keep ringing up sales even when the internet goes down. Syncs automatically when reconnected.' },
                    { title: 'Hardware Integrations', color: 'green', desc: 'Plug and play support for receipt printers, cash drawers, and barcode scanners.' },
                    { title: 'Custom Tiers', color: 'purple', desc: 'Easily configure tax rates, wholesale discounts, and loyalty programs on the fly.' }
                  ].map((feat, idx) => (
                    <motion.li 
                      key={feat.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + (idx * 0.1) }}
                      className="flex gap-4 group"
                    >
                      <div className={`w-10 h-10 rounded-full bg-${feat.color}-500/20 flex items-center justify-center shrink-0 group-hover:bg-${feat.color}-500/30 transition-colors`}>
                        <div className={`w-3 h-3 rounded-full bg-${feat.color}-400 shadow-[0_0_10px_rgba(255,255,255,0.5)]`}></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-white">{feat.title}</h4>
                        <p className="text-slate-400 mt-1">{feat.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative perspective-[1000px] order-1 lg:order-2"
              >
                <img src="/assets/pos_terminal.png" alt="Sleek POS Terminal" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl shadow-blue-900/20 border border-slate-600 hover:shadow-blue-500/20 transition-shadow duration-500" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
