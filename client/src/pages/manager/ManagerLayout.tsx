import { ReactNode, useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  Tags, 
  AlertTriangle,
  Search, 
  Bell, 
  ChevronDown, 
  LogOut,
  User,
  Settings as SettingsIcon,
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
import { getInitials } from "@/lib/index";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/manager" },
  { id: "inventory", label: "Inventory", icon: Package, path: "/manager/inventory" },
  { id: "suppliers", label: "Suppliers", icon: Truck, path: "/manager/suppliers" },
  { id: "employees", label: "Employees", icon: Users, path: "/manager/employees" },
  { id: "sales", label: "Sales Reports", icon: BarChart3, path: "/manager/sales" },
  { id: "promotions", label: "Promotions", icon: Tags, path: "/manager/promotions" },
  { id: "alerts", label: "Low Stock Alerts", icon: AlertTriangle, path: "/manager/alerts" },
];

export const ManagerLayout = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<"profile" | "settings">("profile");
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/');
  };

  const currentNavItem = NAV_ITEMS.find(item => {
    if (item.path === "/manager" && location.pathname === "/manager") return true;
    if (item.path !== "/manager" && location.pathname.startsWith(item.path)) return true;
    return false;
  }) || NAV_ITEMS[0];

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden font-sans">
      {/* Fixed Sidebar */}
      <aside className="w-[220px] bg-card border-r flex flex-col z-20 flex-shrink-0 h-screen">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b flex-shrink-0">
          <div className="bg-[#1a8a3c] p-2 rounded-lg mr-3">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-black tracking-tighter text-lg text-foreground">
            RetailPro
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === "/manager" 
              ? location.pathname === "/manager"
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  isActive 
                    ? "bg-[#1a8a3c]/10 text-[#1a8a3c] font-bold" 
                    : "text-muted-foreground hover:bg-muted font-medium"
                }`}
                end={item.path === "/manager"}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-[#1a8a3c] rounded-r-full -ml-4" />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#1a8a3c]" : "group-hover:text-[#1a8a3c]"}`} />
                <span className="text-sm">
                  {item.label}
                </span>
                {item.id === "alerts" && (
                  <Badge variant="destructive" className="ml-auto bg-[#a32d2d] text-white hover:bg-[#a32d2d]/90 font-black text-[10px] px-2 py-0">18</Badge>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t flex-shrink-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-xl hover:bg-red-50 hover:text-[#a32d2d] text-muted-foreground group"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-8 flex-shrink-0 z-10 w-full">
          <div className="flex items-center gap-3">
            <Badge className="bg-[#1a8a3c] hover:bg-[#1a8a3c]/90 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              MANAGER
            </Badge>
            <h2 className="text-sm font-bold text-foreground">
              {currentNavItem?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Global search..." className="pl-10 h-10 text-xs rounded-lg bg-muted/30 border-muted focus-visible:ring-[#1a8a3c]" />
            </div>

            <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#a32d2d] rounded-full border-2 border-card" />
            </Button>

            <div className="h-8 w-[1px] bg-border mx-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1 flex items-center gap-2 group hover:bg-transparent">
                  <Avatar className="w-8 h-8 border-2 border-transparent group-hover:border-[#1a8a3c] transition-colors rounded-full">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-[#1a8a3c]/10 text-[#1a8a3c] text-xs font-bold">
                      {user?.name ? getInitials(user.name) : "MN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold leading-tight text-foreground">{user?.name || "Manager User"}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{user?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground ml-1 group-hover:text-foreground transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="gap-2 focus:bg-[#1a8a3c]/10 focus:text-[#1a8a3c] cursor-pointer rounded-lg"
                  onClick={() => { setProfileModalTab("profile"); setIsProfileModalOpen(true); }}
                >
                  <User className="w-4 h-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="gap-2 focus:bg-[#1a8a3c]/10 focus:text-[#1a8a3c] cursor-pointer rounded-lg"
                  onClick={() => { setProfileModalTab("settings"); setIsProfileModalOpen(true); }}
                >
                  <SettingsIcon className="w-4 h-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[#a32d2d] gap-2 rounded-lg cursor-pointer hover:bg-red-50 hover:text-[#a32d2d]" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        defaultTab={profileModalTab} 
      />
    </div>
  );
};

export default ManagerLayout;
