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
import { toast } from "sonner";
import api from "@/api/api";
import { Plus, Loader2 } from "lucide-react";

interface AddSupplierModalProps {
  onSuccess: () => void;
}

export function AddSupplierModal({ onSuccess }: AddSupplierModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    category: "General",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/suppliers", formData);
      toast.success("Supplier successfully added to directory!");
      setOpen(false);
      onSuccess(); // Trigger refresh
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        category: "General",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl gap-2 font-black h-12 px-6 bg-[#1a8a3c] hover:bg-[#1a8a3c]/90 text-white">
          <Plus className="w-5 h-5" /> ADD SUPPLIER
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Add New Supplier</DialogTitle>
          <DialogDescription>
            Register a vendor or partner to your directory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">Supplier Org Name</Label>
            <Input 
              id="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g. Apex Global Supplies"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson" className="font-bold">Contact Person</Label>
            <Input 
              id="contactPerson" 
              required 
              value={formData.contactPerson}
              onChange={(e) => setFormData(prev => ({...prev, contactPerson: e.target.value}))}
              placeholder="e.g. Robert Singh"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email</Label>
              <Input 
                id="email" 
                type="email"
                required 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-bold">Phone</Label>
              <Input 
                id="phone" 
                type="tel"
                required 
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
             <Label htmlFor="category" className="font-bold">Primary Category Provided</Label>
             <Input 
               id="category" 
               required 
               value={formData.category}
               onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
             />
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#1a8a3c] hover:bg-[#1a8a3c]/90 text-white rounded-xl font-bold px-8"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Supplier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
