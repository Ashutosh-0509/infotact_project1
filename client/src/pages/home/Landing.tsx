import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortalCards } from './components/PortalCards';
import { StatsSection } from './components/StatsSection';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Hero />
        <PortalCards />
        <StatsSection />
      </main>
      <footer className="py-8 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} POS Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
