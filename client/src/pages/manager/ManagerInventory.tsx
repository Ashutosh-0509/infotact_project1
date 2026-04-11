import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, Trash2 } from "lucide-react";
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
import { AddProductModal } from "./AddProductModal";

// Local interface reflecting the backend model
interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  stock: number;
  price: number;
  isActive: boolean;
}

export const ManagerInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string, name: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success(`${name} has been removed from inventory`);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-black tracking-tighter">Product Inventory</h1>
           <p className="text-muted-foreground text-sm">Manage your store products and stock dynamically.</p>
         </div>
         {/* Live Add Product Modal Replaces old static button */}
         <AddProductModal onSuccess={fetchProducts} />
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-[400px] relative">
        {loading ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a8a3c] mb-4" />
              <p className="font-bold text-muted-foreground text-sm">Syncing with database...</p>
           </div>
        ) : products.length === 0 ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                 <span className="text-2xl">📦</span>
              </div>
              <p className="font-black text-xl mb-1">No products found</p>
              <p className="text-muted-foreground text-sm">Your inventory is currently empty. Click 'Add Product' to get started.</p>
           </div>
        ) : null}

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-black uppercase text-[10px]">Product Name</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Category</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Stock</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Price</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Status</TableHead>
              <TableHead className="text-right font-black uppercase text-[10px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const stock = p.stock || 0;
              let statusBadge = <Badge className="bg-[#1a8a3c] hover:bg-[#1a8a3c] text-white border-none rounded-full px-3 py-0.5 pointer-events-none">In Stock</Badge>;
              if (stock === 0) {
                statusBadge = <Badge className="bg-[#a32d2d] hover:bg-[#a32d2d] text-white border-none rounded-full px-3 py-0.5 pointer-events-none">Out of Stock</Badge>;
              } else if (stock < 50) {
                statusBadge = <Badge className="bg-[#e67e00] hover:bg-[#e67e00] text-white border-none rounded-full px-3 py-0.5 pointer-events-none">Low Stock</Badge>;
              }
              
              return (
                <TableRow key={p.id} className="hover:bg-muted/50 transition-colors group">
                  <TableCell className="font-bold text-sm">
                    {p.name}
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{p.sku}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{p.categoryId}</span>
                  </TableCell>
                  <TableCell className="font-bold text-lg">
                    {stock}
                  </TableCell>
                  <TableCell className="font-black text-sm">₹{p.price}</TableCell>
                  <TableCell>
                     {statusBadge}
                  </TableCell>
                  <TableCell className="text-right">
                     <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#1a8a3c]/10 hover:text-[#1a8a3c]" onClick={() => toast("Editing module not strictly built yet!")}>
                         <Edit className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#a32d2d]/10 hover:text-[#a32d2d]" onClick={() => deleteProduct(p.id, p.name)}>
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </div>
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

export default ManagerInventory;
