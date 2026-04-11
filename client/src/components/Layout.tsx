import { useState, ReactNode } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  ShoppingBag,
  Users,
  Truck,
  UserCog,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Bot
} from 'lucide-react';
import { ROUTE_PATHS } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getInitials } from '@/lib/index';
import { toast } from 'sonner';
import { ProfileSettingsModal } from '@/components/ProfileSettingsModal';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: any;
  badge?: number;
}

const getNavItems = (role?: string): NavItem[] => {
  const baseItems: NavItem[] = [
    { path: ROUTE_PATHS.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { path: ROUTE_PATHS.DASHBOARD_SALES, label: 'Sales', icon: ShoppingBag },
    { path: ROUTE_PATHS.DASHBOARD_INVENTORY, label: 'Inventory', icon: Warehouse },
    { path: ROUTE_PATHS.DASHBOARD_CUSTOMERS, label: 'Customers', icon: Users },
    { path: ROUTE_PATHS.DASHBOARD_REPORTS, label: 'Reports', icon: BarChart3 },
    { path: ROUTE_PATHS.AI_PREDICTIONS, label: 'AI Predictions', icon: Bot },
  ];

  if (role === 'admin') {
    baseItems.push({ path: ROUTE_PATHS.DASHBOARD_USERS, label: 'Users & Roles', icon: UserCog });
  }

  baseItems.push({ path: ROUTE_PATHS.DASHBOARD_SETTINGS, label: 'Settings', icon: Settings });

  return baseItems;
};

const sidebarVariants = {
  expanded: { width: 280 },
  collapsed: { width: 80 },
};

const contentVariants = {
  expanded: { marginLeft: 280 },
  collapsed: { marginLeft: 80 },
};

export default function Layout({ children }: LayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<"profile" | "settings">("profile");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully', {
      className: 'bg-background border-primary/50 text-foreground',
    });
    navigate('/');
  };

  const notifications = [
    { id: 1, title: 'Low stock: Amul Butter — 3 units left', message: '', time: '2m ago', unread: true, type: 'critical' },
    { id: 2, title: 'Payment received ₹5,600 — Rajesh Kumar', message: '', time: '5m ago', unread: true, type: 'success' },
    { id: 3, title: 'New order #T89342 pending', message: '', time: '12m ago', unread: false, type: 'warning' },
    { id: 4, title: 'Stock received: Parle-G 500 units', message: '', time: '1h ago', unread: false, type: 'info' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial="expanded"
        animate={isSidebarExpanded ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-card/30 backdrop-blur-xl border-r border-primary/10 z-40 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-primary/10">
            <AnimatePresence mode="wait">
              {isSidebarExpanded ? (
                <motion.div
                  key="logo-expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">RETAIL PRO</span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center mx-auto"
                >
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {getNavItems(user?.role?.toLowerCase()).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        }`
                      }
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                      <AnimatePresence mode="wait">
                        {isSidebarExpanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActive"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_var(--primary)]"
                        />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-primary/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="w-full justify-center hover:bg-primary/10 hover:text-primary"
            >
              {isSidebarExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.div
        animate={isSidebarExpanded ? 'expanded' : 'collapsed'}
        variants={contentVariants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen relative"
      >
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-primary/10">
          <div className="flex items-center justify-between h-full px-8">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="search"
                  placeholder="Search everything..."
                  className="pl-10 bg-white/5 border-primary/10 focus:border-primary/30 focus:ring-1 focus:ring-primary/30 transition-all rounded-full"
                />
              </div>
            </div>

            {/* Dashboard Button (Center) */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <Link to={ROUTE_PATHS.DASHBOARD}>
                <Button 
                  variant={location.pathname === ROUTE_PATHS.DASHBOARD ? 'secondary' : 'ghost'}
                  className={`rounded-full px-6 transition-all ${location.pathname === ROUTE_PATHS.DASHBOARD ? 'bg-primary/20 text-primary border border-primary/50' : ''}`}
                >
                  Dashboard
                </Button>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10 hover:text-primary transition-all rounded-full"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-background animate-pulse shadow-[0_0_10px_var(--primary)]">
                    {unreadCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 hover:bg-primary/10 rounded-full flex items-center gap-2 group transition-all">
                    <div className="relative">
                      <Avatar className="w-9 h-9 border border-primary/20 group-hover:border-primary/50 transition-colors">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">SB</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                    </div>
                    <div className="hidden md:flex flex-col items-start pr-2">
                      <span className="text-sm font-semibold tracking-tight leading-none group-hover:text-primary transition-colors">{user?.name || "Admin"}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{user?.role || "System"}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-card/90 backdrop-blur-xl border-primary/20 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                  <DropdownMenuLabel className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-primary/30">
                        <AvatarFallback className="bg-primary/20 text-primary">SB</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{user?.name || "Admin"}</span>
                        <span className="text-xs text-muted-foreground">{user?.email || "admin@retailpro.io"}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem 
                    className="flex items-center gap-3 py-2 px-3 focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg transition-all"
                    onClick={() => { setProfileModalTab("profile"); setIsProfileModalOpen(true); }}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-3 py-2 px-3 focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg transition-all"
                    onClick={() => { setProfileModalTab("settings"); setIsProfileModalOpen(true); }}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 px-3 focus:bg-red-500/10 focus:text-red-500 text-red-400 cursor-pointer rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Notifications Panel (Slide-in) */}
        <AnimatePresence>
          {showNotifications && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-screen w-full max-w-[400px] bg-card/95 backdrop-blur-2xl border-l border-primary/20 z-[101] shadow-[-10px_0_40px_rgba(0,0,0,0.5)]"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-primary/10">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-bold tracking-tight">NOTIFICATIONS</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)} className="rounded-full hover:bg-white/5">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 rounded-2xl border transition-all hover:translate-x-1 ${
                          n.unread ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-white/5 hover:border-primary/10'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                            n.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                            n.type === 'success' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' :
                            n.type === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
                            'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
                          }`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${n.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 inline-block">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 border-t border-primary/10">
                    <Button className="w-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all rounded-xl py-6 font-bold tracking-tight">
                      MARK ALL AS READ
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Profile Settings Modal */}
        <ProfileSettingsModal 
           isOpen={isProfileModalOpen} 
           onClose={() => setIsProfileModalOpen(false)} 
           defaultTab={profileModalTab} 
        />
      </motion.div>
    </div>
  );
}
