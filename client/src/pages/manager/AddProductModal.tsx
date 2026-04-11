import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateSKU } from "@/lib/index";
import { toast } from "sonner";
import api from "@/api/api";
import { Plus, Loader2 } from "lucide-react";

interface AddProductModalProps {
  onSuccess: () => void;
}

export function AddProductModal({ onSuccess }: AddProductModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "General",
    stock: 0,
    lowStockThreshold: 10,
    price: 0,
    costPrice: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/products", {
        ...formData,
        sku: generateSKU(), // generate SKU exactly like lib suggests
      });
      toast.success("Product successfully added to inventory!");
      setOpen(false);
      onSuccess(); // Trigger refresh callback
      setFormData({
        name: "",
        categoryId: "General",
        stock: 0,
        lowStockThreshold: 10,
        price: 0,
        costPrice: 0,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl gap-2 font-black h-12 px-6 bg-[#1a8a3c] hover:bg-[#1a8a3c]/90 text-white">
          <Plus className="w-5 h-5" /> ADD PRODUCT
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product for your store inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">Product Name</Label>
            <Input 
              id="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g. Nike Air Max"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="font-bold">Category</Label>
              <Input 
                id="category" 
                required 
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({...prev, categoryId: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock" className="font-bold">Initial Stock</Label>
              <Input 
                id="stock" 
                type="number" 
                required 
                min={0}
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({...prev, stock: Number(e.target.value)}))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="font-bold">Selling Price (₹)</Label>
              <Input 
                id="price" 
                type="number" 
                required 
                min={0}
                value={formData.price}
                onChange={(e) => setFormData(prev => ({...prev, price: Number(e.target.value)}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost" className="font-bold">Cost Price (₹)</Label>
              <Input 
                id="cost" 
                type="number" 
                min={0}
                value={formData.costPrice}
                onChange={(e) => setFormData(prev => ({...prev, costPrice: Number(e.target.value)}))}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#1a8a3c] hover:bg-[#1a8a3c]/90 text-white rounded-xl font-bold px-8"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
