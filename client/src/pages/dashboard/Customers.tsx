import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Save,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const customers = [
    { name: "Rajesh Kumar", phone: "9876543210", orders: 24, spent: "₹12,450", lastVisit: "2 days ago", initials: "RK" },
    { name: "Priya Sharma", phone: "9845678901", orders: 18, spent: "₹8,230", lastVisit: "1 week ago", initials: "PS" },
    { name: "Amit Patel", phone: "9823456789", orders: 12, spent: "₹5,670", lastVisit: "Yesterday", initials: "AP" },
    { name: "Sunita Devi", phone: "9812345678", orders: 9, spent: "₹3,890", lastVisit: "3 days ago", initials: "SD" },
    { name: "Suresh Patil", phone: "9898989898", orders: 32, spent: "₹24,500", lastVisit: "Today", initials: "SP" },
    { name: "Kavita More", phone: "9765432109", orders: 15, spent: "₹7,120", lastVisit: "5 days ago", initials: "KM" },
  ];

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAddOpen(false);
      toast.success('Customer Added Successfully', {
        className: 'bg-background border-primary/50 text-foreground',
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase border-l-4 border-primary pl-4">CUSTOMERS</h1>
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30 rounded-2xl px-6 py-6 font-black gap-2 shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all"
        >
          <UserPlus className="w-5 h-5" /> ADD CUSTOMER
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/40 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between mb-8">
              <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-xl group-hover:border-primary/50 transition-colors">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-black">{c.initials}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-full">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-black tracking-tight">{c.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                   <Phone className="w-3.5 h-3.5 text-primary opacity-60" />
                   <span className="text-sm font-medium tracking-widest">{c.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-0.5">Orders</span>
                  <div className="flex items-center gap-2 text-primary">
                    <ShoppingBag className="w-4 h-4 opacity-50" />
                    <p className="font-black text-xl">{c.orders}</p>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mr-0.5">Total Spent</span>
                  <p className="font-black text-xl text-green-400">{c.spent}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 opacity-60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-tight">Last: {c.lastVisit}</span>
                </div>
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-[10px] font-black uppercase tracking-widest py-1">Silver Member</Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-card/20 backdrop-blur-xl border border-primary/10 rounded-[3rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 max-w-lg relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search customers by name, phone or email..."
            className="pl-12 bg-black/40 border-primary/10 focus:border-primary/40 rounded-2xl h-14 font-medium"
          />
        </div>
        
        <div className="flex items-center gap-6 self-end md:self-center">
          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Page 1 of 42</p>
          <div className="flex gap-2">
             <Button variant="outline" size="icon" className="rounded-2xl border-primary/10 bg-black/40 hover:bg-primary/10 h-14 w-14"><ChevronLeft className="w-5 h-5" /></Button>
             <Button variant="outline" size="icon" className="rounded-2xl border-primary/10 bg-black/40 hover:bg-primary/10 h-14 w-14 shadow-inner text-primary border-primary/40">1</Button>
             <Button variant="outline" size="icon" className="rounded-2xl border-primary/10 bg-black/40 hover:bg-primary/10 h-14 w-14"><ChevronRight className="w-5 h-5" /></Button>
          </div>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-2xl">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl">New Customer</DialogTitle>
                <DialogDescription>Add a new customer to your database.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-6">
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input required placeholder="Ex: Rahul Sharma" className="bg-black/20 border-primary/10 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Phone Number</label>
                  <Input required placeholder="Ex: 9876543210" className="bg-black/20 border-primary/10 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email (Optional)</label>
                  <Input type="email" placeholder="Ex: rahul@example.com" className="bg-black/20 border-primary/10 rounded-xl h-12" />
                </div>
             </div>
             <DialogFooter className="mt-8 border-t border-primary/10 pt-6">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" className="rounded-xl uppercase font-black tracking-widest text-xs h-14 px-8">Cancel</Button>
                </DialogClose>
                <Button 
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl h-14 px-10 shadow-[0_10px_20px_rgba(var(--primary),0.3)] gap-2 uppercase tracking-tight"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isLoading ? 'Wait...' : 'Register Customer'}
                </Button>
             </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
