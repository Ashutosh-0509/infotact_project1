import React from 'react';
import { Twitter, Linkedin, Github, Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">POS Pro</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Next-generation retail management system empowering businesses worldwide.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Subscribe to our newsletter</h3>
          <p className="text-sm text-slate-500 mb-4">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required 
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} POS Pro, Inc. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
