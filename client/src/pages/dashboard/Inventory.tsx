import { useState } from 'react';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  AlertCircle, 
  ShoppingCart, 
  Plus,
  Search,
  Filter,
  Monitor,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Layers,
  ArrowUpRight,
  DollarSign,
  Save,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/NeonDialog';
import { toast } from 'sonner';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const stats = [
    { title: "Total Products", value: "842", icon: Layers, color: "text-blue-400" },
    { title: "Low Stock", value: "12", icon: AlertCircle, color: "text-amber-400" },
    { title: "Out of Stock", value: "3", icon: AlertCircle, color: "text-red-400" },
    { title: "Total Value ₹", value: "₹4,25,600", icon: DollarSign, color: "text-green-400" },
  ];

  const [products, setProducts] = useState([
    { name: "Amul Butter 500g", sku: "AMUL-B01", category: "Dairy", stock: 45, minStock: 20, price: "₹280", status: "In Stock" },
    { name: "Parle-G 800g", sku: "PARLE-G01", category: "Snacks", stock: 12, minStock: 20, price: "₹45", status: "Low Stock" },
    { name: "Tata Salt 1kg", sku: "TATA-S01", category: "Pantry", stock: 120, minStock: 30, price: "₹22", status: "In Stock" },
    { name: "Maggi Noodles", sku: "MAGGI-N01", category: "Instant Food", stock: 4, minStock: 15, price: "₹14", status: "Critical" },
    { name: "Coca Cola 750ml", sku: "COKE-750", category: "Beverages", stock: 0, minStock: 10, price: "₹40", status: "Out of Stock" },
  ]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAddOpen(false);
      toast.success('Product Added Successfully', {
        className: 'bg-background border-primary/50 text-foreground',
      });
    }, 2000);
  };

  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsDeleteOpen(false);
      toast.success('Product Deleted From Inventory', {
        className: 'bg-background border-red-500/50 text-red-400',
      });
    }, 1500);
  };

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock === 0) return <Badge className="bg-red-500/20 text-red-500 border-red-500/50 animate-pulse font-bold tracking-tighter uppercase px-3 py-1">OUT</Badge>;
    if (stock < 5) return <Badge className="bg-red-900/40 text-red-400 border-red-400/50 animate-[pulse_1.5s_infinite] font-black uppercase px-2 py-1">CRITICAL</Badge>;
    if (stock <= minStock) return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 uppercase font-bold tracking-tight px-3 py-1 text-[10px]">LOW</Badge>;
    return <Badge className="bg-green-500/10 text-green-400 border-green-500/20 uppercase font-black px-3 py-1">OK</Badge>;
  };

  return (
    <div className="theme-neon-blue">
      <Layout>
        <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase border-l-4 border-primary pl-4">INVENTORY</h1>
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-2xl px-6 py-6 font-black gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)] group transition-all"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> ADD PRODUCT
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/40 transition-all cursor-default"
          >
            <div className={`p-4 rounded-3xl bg-black/40 border border-primary/20 w-fit mb-4 shadow-inner`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-black opacity-60 ml-1">{stat.title}</p>
            <h3 className="text-3xl font-black mt-2 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search products by SKU, name or category..."
              className="pl-12 bg-black/40 border-primary/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-2xl h-14 font-medium"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-primary/10 hover:bg-primary/5 rounded-2xl h-14 px-6 gap-2 font-bold tracking-tight">
              <Filter className="w-4 h-4" /> FILTERS
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/10 bg-white/5">
                {['Product', 'SKU', 'Category', 'Stock', 'Min', 'Price', 'Status', ''].map((h) => (
                  <th key={h} className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b border-primary/5 hover:bg-primary/5 transition-all group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-primary/10 flex items-center justify-center overflow-hidden">
                         <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20" />
                      </div>
                      <span className="font-bold text-lg">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-sm text-primary opacity-80 uppercase">{p.sku}</td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 uppercase tracking-tighter text-[10px] py-1 px-3">
                      {p.category}
                    </Badge>
                  </td>
                  <td className={`px-8 py-6 font-black text-xl ${p.stock <= p.minStock ? 'text-amber-400' : 'text-foreground'}`}>
                    {p.stock}
                  </td>
                  <td className="px-8 py-6 text-muted-foreground font-mono">{p.minStock}</td>
                  <td className="px-8 py-6 font-black text-lg">{p.price}</td>
                  <td className="px-8 py-6">
                    {getStockBadge(p.stock, p.minStock)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Button onClick={() => setIsAddOpen(true)} variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary rounded-xl">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => { setSelectedProduct(p); setIsDeleteOpen(true); }} variant="ghost" size="icon" className="hover:bg-red-500/20 hover:text-red-400 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination etc omitted for brevity but kept in code ... */}
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-2xl">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl">Manage Product</DialogTitle>
                <DialogDescription>Fill in the details to update your inventory registry.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Product Name</label>
                <Input required placeholder="Ex: Amul Butter" className="bg-black/20 border-primary/10 rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">SKU ID</label>
                <Input required placeholder="Ex: AMUL-001" className="bg-black/20 border-primary/10 rounded-xl h-12 font-mono uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Category</label>
                <Input required placeholder="Ex: Dairy" className="bg-black/20 border-primary/10 rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Price (₹)</label>
                <Input required type="number" placeholder="0.00" className="bg-black/20 border-primary/10 rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Initial Stock</label>
                <Input required type="number" placeholder="0" className="bg-black/20 border-primary/10 rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Min Threshold</label>
                <Input required type="number" placeholder="5" className="bg-black/20 border-primary/10 rounded-xl h-12" />
              </div>
            </div>
            <DialogFooter className="mt-8 border-t border-primary/10 pt-6">
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="rounded-xl uppercase font-black tracking-widest text-xs h-14 px-8">Discard</Button>
              </DialogClose>
              <Button 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl h-14 px-10 shadow-[0_10px_20px_rgba(var(--primary),0.3)] gap-2 uppercase tracking-tight"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isLoading ? 'Processing...' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md border-red-500/30">
          <DialogHeader>
            <div className="mx-auto p-4 bg-red-500/10 rounded-full mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <DialogTitle className="text-center text-red-400">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to remove <span className="text-foreground font-black">{selectedProduct?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
             <p className="text-[10px] text-red-400/80 uppercase font-black text-center tracking-[0.2em]">All transaction history for this item will be archived.</p>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-4 sm:flex-row sm:justify-center">
            <Button disabled={isLoading} onClick={() => setIsDeleteOpen(false)} variant="ghost" className="rounded-xl uppercase font-black text-xs h-14">Keep Product</Button>
            <Button 
              disabled={isLoading}
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-black rounded-xl h-14 shadow-[0_10px_20px_rgba(239,68,68,0.3)] gap-2 uppercase tracking-tight"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
        </div>
      </Layout>
    </div>
  );
}
