import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { RoleBasedTheme } from "@/components/RoleBasedTheme";
import { 
  Search, 
  LogOut, 
  Clock, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  Pause, 
  X,
  CreditCard,
  Wallet,
  Smartphone,
  Layers,
  Printer,
  Share2,
  ChevronRight,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  MOCK_PRODUCTS, 
  MOCK_CUSTOMERS, 
  CATEGORIES 
} from "@/mockData";
import { formatCurrency } from "@/lib/index";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CashierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/');
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState(MOCK_CUSTOMERS[0]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<"profile" | "settings">("profile");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountReceived, setAmountReceived] = useState("");
  const [orderNumber] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
  
  // Helpers for category styling
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Food': return '🍎';
      case 'Beverages': return '🥤';
      case 'Electronics': return '📱';
      case 'Personal Care': return '🧴';
      default: return '📦';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Food': return 'bg-red-100 group-hover:bg-red-200';
      case 'Beverages': return 'bg-blue-100 group-hover:bg-blue-200';
      case 'Electronics': return 'bg-gray-100 group-hover:bg-gray-200';
      case 'Personal Care': return 'bg-teal-100 group-hover:bg-teal-200';
      default: return 'bg-muted group-hover:bg-primary/5';
    }
  };
  
  // Financial Summary State
  const [dailySales] = useState(45230);
  const [transactions] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.sku);
      if (existing) {
        return prev.map(item => 
          item.id === product.sku ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.sku, name: product.name, price: product.price, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (sku: string) => {
    setCart(prev => prev.filter(item => item.id !== sku));
  };

  const updateQuantity = (sku: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === sku) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const confirmPayment = () => {
    setIsCheckoutOpen(false);
    setIsReceiptOpen(true);
    setCart([]);
    toast.success("Payment Successful!");
  };

  return (
    <RoleBasedTheme role="Cashier">
      <div className="flex flex-col h-screen bg-background overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">POS Billing</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground mr-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            
            <div className="h-8 w-[1px] bg-border" />
            
            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <p className="text-sm font-bold leading-none">{user?.name || "Cashier"}</p>
                <p className="text-xs text-muted-foreground">Store #001</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setProfileModalTab("profile"); setIsProfileModalOpen(true); }} className="hover:text-primary">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:text-destructive">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel - Products */}
          <section className="flex-[0.6] flex flex-col border-r bg-muted/30">
            {/* Toolbar */}
            <div className="p-4 space-y-4 bg-background border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products by name or scan barcode..." 
                  className="pl-10 h-11 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <Button 
                    key={cat}
                    variant={activeCategory === cat ? "default" : "secondary"}
                    size="sm"
                    className="rounded-full px-5 h-8 whitespace-nowrap"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((p, idx) => (
                  <motion.div
                    key={p.sku}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card 
                      className="cursor-pointer hover:border-primary transition-all duration-200 group h-full overflow-hidden"
                      onClick={() => addToCart(p)}
                    >
                      <CardContent className="p-0">
                        <div className={`aspect-square flex items-center justify-center relative transition-colors ${getCategoryColor(p.categoryId)} overflow-hidden`}>
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          ) : (
                            <span className="text-4xl filter drop-shadow-sm transition-transform group-hover:scale-110">
                              {getCategoryIcon(p.categoryId)}
                            </span>
                          )}
                          <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground backdrop-blur-sm shadow border-none group-hover:bg-primary z-10 transition-colors">
                            In Stock: {p.stock}
                          </Badge>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground mb-1">{p.categoryId}</p>
                          <h3 className="font-bold text-sm line-clamp-2 min-h-[40px] leading-tight mb-2">
                            {p.name}
                          </h3>
                          <p className="text-lg font-extrabold text-primary">₹{p.price}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Right Panel - Cart */}
          <section className="flex-[0.4] flex flex-col bg-background">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Current Order</h2>
                <p className="text-xs text-muted-foreground">ID: {orderNumber}</p>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-1 flex items-center gap-1">
                <Layers className="w-3 h-3" /> Walk-in
              </Badge>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
              <AnimatePresence initial={false}>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <ShoppingCart className="w-16 h-16 mb-4" />
                    <p className="font-medium">Cart is empty</p>
                    <p className="text-xs">Scan or click products to add</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 bg-muted/20 p-3 rounded-xl group border border-transparent hover:border-primary/20"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                      </div>
                      
                      <div className="flex items-center gap-1 bg-background rounded-lg border p-1 scale-90">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Cart Footer */}
            <div className="p-6 border-t bg-muted/10 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium">₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="text-lg font-bold">TOTAL</span>
                  <span className="text-2xl font-black text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-2">
                  <Pause className="w-4 h-4" /> Hold
                </Button>
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                  onClick={() => setCart([])}
                >
                  Clear
                </Button>
              </div>

              <Button 
                className="w-full h-14 text-xl font-bold rounded-xl shadow-lg ring-offset-background transition-all active:scale-95 group"
                onClick={handleCheckout}
              >
                CHECKOUT 
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </section>
        </main>

        {/* Daily Summary Bar */}
        <footer className="h-10 bg-primary/5 border-t flex items-center px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest gap-8">
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">Sales Today</span>
            <span className="text-foreground">₹{dailySales.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">Txns</span>
            <span className="text-foreground">{transactions}</span>
          </div>
          <div className="flex-1 h-[1px] bg-border/50" />
          <div className="flex items-center gap-4">
            <span>Cash: ₹12,400</span>
            <span>Card: ₹18,200</span>
            <span>UPI: ₹14,630</span>
          </div>
        </footer>

        {/* Checkout Modal */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="sm:max-w-md bg-background">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary" />
                Complete Payment
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-primary/10 p-4 rounded-xl mb-6 flex justify-between items-center">
                <span className="font-bold text-muted-foreground">Amount Due</span>
                <span className="text-3xl font-black text-primary">₹{total.toFixed(2)}</span>
              </div>

              <Tabs defaultValue="CASH" className="w-full" onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-4 h-16 bg-muted/50 p-1">
                  <TabsTrigger value="CASH" className="flex flex-col gap-1 rounded-lg">
                    <Wallet className="w-4 h-4" />
                    <span className="text-[10px] font-bold">CASH</span>
                  </TabsTrigger>
                  <TabsTrigger value="CARD" className="flex flex-col gap-1 rounded-lg">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-bold">CARD</span>
                  </TabsTrigger>
                  <TabsTrigger value="UPI" className="flex flex-col gap-1 rounded-lg">
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[10px] font-bold">UPI</span>
                  </TabsTrigger>
                  <TabsTrigger value="SPLIT" className="flex flex-col gap-1 rounded-lg">
                    <Layers className="w-4 h-4" />
                    <span className="text-[10px] font-bold">SPLIT</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  {paymentMethod === "CASH" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Amount Received</label>
                        <Input 
                          type="number" 
                          placeholder="Enter cash amount..." 
                          className="h-12 text-xl font-bold" 
                          value={amountReceived}
                          onChange={(e) => setAmountReceived(e.target.value)}
                        />
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg flex justify-between items-center">
                        <span className="text-sm font-bold opacity-50">Change to return</span>
                        <span className="text-xl font-black text-green-600">
                          ₹{amountReceived ? Math.max(0, Number(amountReceived) - total).toFixed(2) : "0.00"}
                        </span>
                      </div>
                    </div>
                  )}
                  {paymentMethod === "CARD" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Card Last 4 Digits</label>
                        <Input placeholder="XXXX" className="h-12 text-xl tracking-[1em] text-center" maxLength={4} />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['Visa', 'Mastercard', 'RuPay'].map(brand => (
                          <Button key={brand} variant="outline" className="h-12 text-xs font-bold uppercase">{brand}</Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {paymentMethod === "UPI" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="w-32 h-32 bg-muted rounded-xl border-2 border-dashed flex items-center justify-center p-2">
                        <div className="w-full h-full border border-primary/20 rounded flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase text-center">
                          QR CODE<br/>PLACEHOLDER
                        </div>
                      </div>
                      <p className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                        UP ID: retailpro@upi
                      </p>
                    </div>
                  )}
                  {paymentMethod === "SPLIT" && (
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground">Cash Amount</label>
                          <Input placeholder="₹0.00" className="h-10" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground">UPI Amount</label>
                          <Input placeholder="₹0.00" className="h-10" />
                        </div>
                      </div>
                      <p className="text-[10px] text-center font-bold text-destructive">Remaining: ₹{total.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </Tabs>
            </div>

            <DialogFooter>
              <Button className="w-full h-14 text-xl font-black rounded-xl bg-green-600 hover:bg-green-700 text-white" onClick={confirmPayment}>
                CONFIRM PAYMENT
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Receipt Modal */}
        <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <DialogContent className="sm:max-w-sm bg-white text-black p-0 font-mono">
            <div className="p-8 space-y-4 relative overflow-hidden">
               {/* Receipt Paper Effect */}
               <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gray-100 to-white" />
               <div className="absolute inset-x-0 bottom-0 h-2 bg-[radial-gradient(circle_at_50%_100%,transparent_10px,white_10px)] bg-[length:20px_20px] bg-repeat-x" />

               <div className="text-center space-y-1">
                 <h2 className="text-2xl font-black tracking-tighter mb-0 flex items-center justify-center gap-2">
                   <ShoppingCart className="w-5 h-5" /> 🛒 RETAIL PRO
                 </h2>
                 <p className="text-[10px] font-bold uppercase">Mumbai Central Store</p>
               </div>

               <div className="border-y border-dashed py-2 text-[10px] space-y-1 font-bold">
                 <div className="flex justify-between">
                   <span>Order: #{orderNumber}</span>
                   <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Cashier: {user?.name || "Cashier"}</span>
                   <span>{currentTime.toLocaleDateString()}</span>
                 </div>
               </div>

               <div className="py-2 space-y-1 min-h-[100px]">
                 <div className="flex justify-between text-[10px] font-black border-b border-dashed pb-1 mb-2">
                   <span>ITEM</span>
                   <div className="flex gap-8">
                     <span>QTY</span>
                     <span>PRICE</span>
                   </div>
                 </div>
                 {/* Fake items used since we empty cart on success */}
                 <div className="flex justify-between text-[10px]">
                   <span className="truncate max-w-[150px]">Amul Butter 500g</span>
                   <div className="flex gap-10">
                     <span>2</span>
                     <span>₹570.00</span>
                   </div>
                 </div>
                 <div className="flex justify-between text-[10px]">
                   <span className="truncate max-w-[150px]">Parle-G 800g</span>
                   <div className="flex gap-10">
                     <span>1</span>
                     <span>₹45.00</span>
                   </div>
                 </div>
               </div>

               <div className="border-t border-dashed pt-2 space-y-1 text-[10px] font-bold">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span>₹615.00</span>
                 </div>
                 <div className="flex justify-between">
                   <span>GST (18%)</span>
                   <span>₹110.70</span>
                 </div>
                 <div className="flex justify-between text-base font-black pt-2 border-t border-double mt-2">
                   <span>TOTAL</span>
                   <span>₹725.70</span>
                 </div>
               </div>

               <div className="text-center py-4 space-y-3">
                 <p className="text-[10px] font-black uppercase tracking-widest bg-gray-100 p-2 rounded">
                   Payment: {paymentMethod}
                 </p>
                 <p className="text-[10px] font-bold italic">Thank you! Visit Again!</p>
               </div>
            </div>

            <div className="flex gap-1 p-2 bg-muted/20">
              <Button size="sm" variant="ghost" className="flex-1 text-[10px] font-bold gap-1"><Printer className="w-3 h-3" /> PRINT</Button>
              <Button size="sm" variant="ghost" className="flex-1 text-[10px] font-bold gap-1"><Share2 className="w-3 h-3" /> SHARE</Button>
              <Button 
                size="sm" 
                variant="default" 
                className="flex-2 text-[10px] font-black" 
                onClick={() => setIsReceiptOpen(false)}
              >
                NEW SALE
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Settings Modal */}
        <ProfileSettingsModal 
           isOpen={isProfileModalOpen} 
           onClose={() => setIsProfileModalOpen(false)} 
           defaultTab={profileModalTab} 
        />

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: oklch(0.52 0.18 250 / 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: oklch(0.52 0.18 250 / 0.2);
        }
      `}</style>
    </RoleBasedTheme>
  );
};

export default CashierDashboard;
