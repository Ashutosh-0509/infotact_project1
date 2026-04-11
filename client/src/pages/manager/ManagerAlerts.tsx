import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, AlertTriangle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/api/api";

interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
}

export const ManagerAlerts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products/low-stock');
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const criticalCount = products.filter(p => p.stock === 0).length;
  const lowCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const estRestockCost = products.reduce((acc, p) => acc + (p.price * p.lowStockThreshold), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-black tracking-tighter text-[#a32d2d]">Low Stock Alerts</h1>
           <p className="text-muted-foreground text-sm">Monitor products requiring immediate restock dynamically from database.</p>
         </div>
         <Button 
           className="rounded-xl gap-2 font-black h-12 px-6 bg-[#a32d2d] hover:bg-[#a32d2d]/90 text-white"
           onClick={() => toast.success("Reorder placed for all critical items!")}
         >
           <ShoppingCart className="w-5 h-5" /> ORDER ALL
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
         <Card className="border-none shadow-sm bg-red-50">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-xs font-black text-[#a32d2d] uppercase">Critical (0 units)</p>
              <p className="text-3xl font-black text-[#a32d2d]">{loading ? "-" : criticalCount}</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-orange-50">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-xs font-black text-[#e67e00] uppercase">Low (1-{products[0]?.lowStockThreshold || 10} units)</p>
              <p className="text-3xl font-black text-[#e67e00]">{loading ? "-" : lowCount}</p>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm bg-[#1a8a3c]/10">
            <CardContent className="p-4 flex flex-col items-center">
              <p className="text-xs font-black text-[#1a8a3c] uppercase">Est. Restock Value</p>
              <p className="text-3xl font-black text-[#1a8a3c]">₹{loading ? "---" : estRestockCost.toLocaleString()}</p>
            </CardContent>
         </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-[300px] relative">
        {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#a32d2d] mb-4" />
                <p className="font-bold text-muted-foreground text-sm">Syncing alerts...</p>
             </div>
          ) : products.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 text-[#1a8a3c]">
                   <AlertTriangle className="w-8 h-8" />
                </div>
                <p className="font-black text-xl mb-1 text-[#1a8a3c]">All Stock Healthy</p>
                <p className="text-muted-foreground text-sm">No products are currently under the low stock threshold.</p>
             </div>
          ) : null}

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-black uppercase text-[10px]">Product</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Category</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Units Left</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Reorder Level</TableHead>
              <TableHead className="text-right font-black uppercase text-[10px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const stock = p.stock || 0;
              const isCritical = stock === 0;
              return (
                <TableRow key={p.id} className={`transition-colors ${isCritical ? 'bg-red-50/30' : 'hover:bg-muted/50'}`}>
                  <TableCell className="font-bold text-sm">
                    {p.name}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{p.categoryId}</span>
                  </TableCell>
                  <TableCell className={`font-black text-lg ${isCritical ? 'text-[#a32d2d]' : 'text-[#e67e00]'}`}>
                    {stock}
                  </TableCell>
                  <TableCell className="text-sm font-bold opacity-60">{p.lowStockThreshold}</TableCell>
                  <TableCell className="text-right">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className={`font-black text-[10px] ${isCritical ? 'text-[#a32d2d] border-[#a32d2d] hover:bg-[#a32d2d] hover:text-white' : 'text-[#e67e00] border-[#e67e00] hover:bg-[#e67e00] hover:text-white'}`}
                       onClick={() => toast.success(`Reorder request queued for ${p.name}`)}
                     >
                       REORDER
                     </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ManagerAlerts;
