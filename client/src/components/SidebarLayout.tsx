import { useState, ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  ChevronDown, 
  LogOut,
  User,
  Settings as SettingsIcon,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { RoleBasedTheme } from "@/components/RoleBasedTheme";
import { getInitials, UserRole } from "@/lib/index";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal";

interface NavItem {
  label: string;
  icon: any;
  id: string;
}

interface SidebarLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  role: UserRole;
  activeTab: string;
  onTabChange: (id: string) => void;
}

const SidebarLayout = ({ children, navItems, role, activeTab, onTabChange }: SidebarLayoutProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<"profile" | "settings">("profile");
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <RoleBasedTheme role={role}>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarExpanded ? 260 : 80 }}
          className="bg-card border-r flex flex-col z-20"
        >
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b">
            <div className="bg-primary p-2 rounded-lg mr-3">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            {isSidebarExpanded && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black tracking-tighter text-lg"
              >
                RETAIL PRO
              </motion.span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? "" : "group-hover:text-primary"}`} />
                {isSidebarExpanded && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-bold text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
                {activeTab === item.id && (
                   <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 rounded-xl hover:bg-destructive/10 hover:text-destructive group"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarExpanded && <span className="font-bold">Logout</span>}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-full flex justify-center hover:bg-muted"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            >
              {isSidebarExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </motion.aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tight py-0">
                {role}
              </Badge>
              <h2 className="text-sm font-bold text-muted-foreground">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Global search..." className="pl-10 h-9 text-xs rounded-full bg-muted/50 border-none" />
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </Button>

              <div className="h-8 w-[1px] bg-border mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 flex items-center gap-2 group">
                    <Avatar className="w-8 h-8 border-2 border-primary/20 group-hover:border-primary transition-colors">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {user?.name ? getInitials(user.name) : "RP"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-black leading-tight">{user?.name || "Admin User"}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{user?.email}</p>
                    </div>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer"
                    onClick={() => { setProfileModalTab("profile"); setIsProfileModalOpen(true); }}
                  >
                    <User className="w-4 h-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer"
                    onClick={() => { setProfileModalTab("settings"); setIsProfileModalOpen(true); }}
                  >
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive gap-2" onClick={logout}>
                    <LogOut className="w-4 h-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-muted/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--primary);
          opacity: 0.1;
          border-radius: 10px;
        }
      `}</style>
      
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        defaultTab={profileModalTab} 
      />
    </RoleBasedTheme>
  );
};

export default SidebarLayout;
