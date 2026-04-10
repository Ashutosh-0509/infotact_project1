import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Store, 
  Percent, 
  Bell, 
  Palette, 
  ShieldCheck,
  Save,
  Lock,
  Globe,
  Smartphone,
  CreditCard,
  User as UserIcon,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Store Info');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'Store Info', icon: Store },
    { id: 'Tax', icon: Percent },
    { id: 'Notifications', icon: Bell },
    { id: 'Appearance', icon: Palette },
    { id: 'Security', icon: ShieldCheck },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Changes Saved Successfully', {
        className: 'bg-background border-primary/50 text-foreground',
        icon: <CheckCircle2 className="w-5 h-5 text-green-400" />
      });
    }, 1500);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Store Info':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Store Name</label>
                <Input defaultValue="RETAIL PRO HUB" className="bg-black/20 border-primary/10 rounded-xl h-12 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Email Address</label>
                <Input defaultValue="contact@retailpro.io" className="bg-black/20 border-primary/10 rounded-xl h-12 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">GST Number</label>
                <Input defaultValue="27AAAAA0000A1Z5" className="bg-black/20 border-primary/10 rounded-xl h-12 font-mono uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Phone Number</label>
                <Input defaultValue="+91 98765 43210" className="bg-black/20 border-primary/10 rounded-xl h-12 font-bold" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Store Address</label>
                <Textarea 
                  defaultValue="123, Retail Pro Tower, BKC, Mumbai - 400051" 
                  className="bg-black/20 border-primary/10 rounded-2xl min-h-[100px] font-medium resize-none" 
                />
              </div>
            </div>
          </motion.div>
        );
      case 'Appearance':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
             <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest">Theme Preview</h4>
                <div className="grid grid-cols-3 gap-4">
                   <div className="aspect-video rounded-2xl border-2 border-primary bg-background flex items-center justify-center relative shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                      <span className="text-[10px] font-bold uppercase tracking-tight">Dark Neon (Current)</span>
                   </div>
                   <div className="aspect-video rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center opacity-50 grayscale cursor-not-allowed">
                      <span className="text-[10px] font-bold uppercase tracking-tight">Vibrant Blue</span>
                   </div>
                   <div className="aspect-video rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center opacity-50 grayscale cursor-not-allowed">
                      <span className="text-[10px] font-bold uppercase tracking-tight">Emerald Green</span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest">Primary Color</h4>
                <div className="flex gap-4">
                   {['#00f2ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                      <button 
                        key={color} 
                        className={`w-10 h-10 rounded-xl shadow-lg transition-all ${color === '#00f2ff' ? 'scale-125 border-2 border-white/20' : 'opacity-40 hover:opacity-100 hover:scale-110'}`} 
                        style={{ backgroundColor: color }} 
                      />
                   ))}
                </div>
             </div>
          </motion.div>
        );
      case 'Security':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 max-w-md"
          >
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Current Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-black/20 border-primary/10 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-black/20 border-primary/10 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Confirm New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-black/20 border-primary/10 rounded-xl h-12" />
                </div>
             </div>
             <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Ensure your password is at least 12 characters long and contains a mix of symbols, numbers, and case-sensitive letters.
                </p>
             </div>
          </motion.div>
        );
      default:
        return <div className="p-20 text-center text-muted-foreground uppercase font-black tracking-widest opacity-20">Settings Module Loading...</div>;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase border-l-4 border-primary pl-4">SETTINGS</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full justify-start gap-4 rounded-2xl h-14 font-bold tracking-tight transition-all relative ${
                activeTab === tab.id ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : 'opacity-40'}`} />
              {tab.id.toUpperCase()}
              {activeTab === tab.id && (
                <motion.div layoutId="settingActive" className="absolute right-4 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
              )}
            </Button>
          ))}
        </div>

        <div className="bg-card/30 backdrop-blur-3xl border border-primary/10 rounded-[3rem] p-10 flex flex-col min-h-[600px]">
          <div className="flex-1">
             <div className="mb-10 flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl">
                   {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "w-6 h-6 text-primary" })}
                </div>
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tight">{activeTab}</h2>
                   <p className="text-xs text-muted-foreground uppercase tracking-widest opacity-60">Manage your store's {activeTab.toLowerCase()} preferences</p>
                </div>
             </div>

             <AnimatePresence mode="wait">
                {renderTabContent()}
             </AnimatePresence>
          </div>

          <div className="mt-12 pt-8 border-t border-primary/10 flex justify-end gap-4">
             <Button variant="ghost" className="rounded-xl px-8 uppercase font-bold tracking-widest text-xs opacity-60">Discard</Button>
             <Button 
               className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-10 h-14 font-black shadow-[0_0_20px_rgba(var(--primary),0.3)] gap-2"
               onClick={handleSave}
               disabled={isSaving}
             >
               {isSaving ? (
                 <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
               ) : (
                 <Save className="w-5 h-5" />
               )}
               {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
