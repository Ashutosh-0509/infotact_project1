import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Laptop, Moon, Sun, Monitor, Bell, Palette } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/index";
import { toast } from "sonner";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "profile" | "settings";
}

export const ProfileSettingsModal = ({ isOpen, onClose, defaultTab = "profile" }: ProfileSettingsModalProps) => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("system");
  
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, isOpen]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required");
      return;
    }
    
    // Fallback avatar generation if they clear the input
    const newAvatar = formData.avatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.split(' ').join('')}`;
    
    updateUser({
      name: formData.name,
      email: formData.email,
      avatar: newAvatar,
    });
    
    toast.success("Profile updated successfully!");
    onClose();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving settings
    toast.success("Preferences saved successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl bg-card border-primary/20 shadow-2xl p-0 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/30 to-purple-500/30 relative">
           {/* Banner background */}
        </div>
        
        <div className="px-6 pb-6 -mt-12 text-foreground">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24 border-4 border-card shadow-2xl bg-card">
              <AvatarImage src={formData.avatar || user?.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                {formData.name ? getInitials(formData.name) : "RP"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <DialogHeader className="mb-6 opacity-0 h-0 w-0 overflow-hidden">
             {/* Invisible header to satisfy Dialog accessibility requirements without polluting our custom UI */}
             <DialogTitle>Profile and Settings</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-9 h-11"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Avatar URL</label>
                  <Input 
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://api.dicebear.com/..."
                    className="h-11 font-mono text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground px-1">Leave blank to auto-generate based on your name.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-3 rounded-xl bg-muted/50 border flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Role</span>
                    <span className="text-sm font-black text-primary">{user?.role}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Joined</span>
                    <span className="text-sm font-black tracking-tight">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 font-bold mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Save Profile Changes
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="settings">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
                    <Palette className="w-4 h-4 text-primary" /> Appearance
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                     <Button 
                       type="button"
                       variant={themeMode === "light" ? "default" : "outline"}
                       onClick={() => setThemeMode("light")}
                       className="flex flex-col gap-2 h-auto py-3 relative overflow-hidden"
                     >
                       <Sun className="w-5 h-5" />
                       <span className="text-xs font-bold">Light</span>
                     </Button>
                     <Button 
                       type="button"
                       variant={themeMode === "dark" ? "default" : "outline"}
                       onClick={() => setThemeMode("dark")}
                       className="flex flex-col gap-2 h-auto py-3 relative overflow-hidden"
                     >
                       <Moon className="w-5 h-5" />
                       <span className="text-xs font-bold">Dark</span>
                     </Button>
                     <Button 
                       type="button"
                       variant={themeMode === "system" ? "default" : "outline"}
                       onClick={() => setThemeMode("system")}
                       className="flex flex-col gap-2 h-auto py-3 relative overflow-hidden"
                     >
                       <Monitor className="w-5 h-5" />
                       <span className="text-xs font-bold">System</span>
                     </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
                    <Bell className="w-4 h-4 text-primary" /> Notifications
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
                      <div>
                        <p className="text-sm font-bold">Daily Summaries</p>
                        <p className="text-[10px] text-muted-foreground">Receive end-of-day sales reports via email.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </label>
                    <label className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/30 transition-colors cursor-pointer">
                      <div>
                        <p className="text-sm font-bold">Low Stock Alerts</p>
                        <p className="text-[10px] text-muted-foreground">Push notifications for inventory running out.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Save Preferences
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
      <style>{`
        .toggle {
           appearance: none;
           width: 36px;
           height: 20px;
           background: var(--muted);
           border-radius: 20px;
           position: relative;
           outline: none;
           cursor: pointer;
           transition: background 0.3s;
        }
        .toggle:checked {
           background: var(--primary);
        }
        .toggle::after {
           content: '';
           position: absolute;
           top: 2px;
           left: 2px;
           width: 16px;
           height: 16px;
           background: white;
           border-radius: 50%;
           transition: transform 0.3s;
        }
        .toggle:checked::after {
           transform: translateX(16px);
        }
      `}</style>
    </Dialog>
  );
};
