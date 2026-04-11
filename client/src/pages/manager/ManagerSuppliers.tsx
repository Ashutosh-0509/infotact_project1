import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2 } from "lucide-react";
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
import { AddSupplierModal } from "./AddSupplierModal";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  status: string;
  isActive: boolean;
}

export const ManagerSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/suppliers');
      setSuppliers(data);
    } catch (error) {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const deleteSupplier = async (id: string, name: string) => {
    try {
      await api.delete(`/suppliers/${id}`);
      toast.success(`${name} has been removed from directory`);
      fetchSuppliers();
    } catch (error) {
      toast.error("Failed to delete supplier");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-black tracking-tighter">Suppliers Directory</h1>
           <p className="text-muted-foreground text-sm">Manage contacts & vendor directory live from database.</p>
         </div>
         <AddSupplierModal onSuccess={fetchSuppliers} />
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-[400px] relative">
        {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a8a3c] mb-4" />
                <p className="font-bold text-muted-foreground text-sm">Syncing with directory...</p>
             </div>
          ) : suppliers.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                   <span className="text-2xl">🏢</span>
                </div>
                <p className="font-black text-xl mb-1">No suppliers found</p>
                <p className="text-muted-foreground text-sm">Your directory is currently empty. Click 'Add Supplier' to get started.</p>
             </div>
          ) : null}

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-black uppercase text-[10px]">Supplier Name</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Contact</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Category</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Status</TableHead>
              <TableHead className="text-right font-black uppercase text-[10px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s.id} className="hover:bg-muted/50 transition-colors group">
                <TableCell className="font-bold text-sm">
                  {s.name}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{s.contactPerson}</p>
                  <p className="text-xs text-muted-foreground">{s.email} | {s.phone}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.category}
                </TableCell>
                <TableCell>
                  <Badge className={`${s.status === 'Active' ? 'bg-[#1a8a3c]' : 'bg-[#e67e00]'} text-white border-none rounded-full px-3 py-0.5 pointer-events-none hover:opacity-100`}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex justify-end gap-2 items-center">
                      <Button variant="outline" size="sm" className="font-bold border-[#1a8a3c] text-[#1a8a3c] hover:bg-[#1a8a3c]/10" onClick={() => toast("Contacting " + s.name)}>Contact</Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#a32d2d]/10 hover:text-[#a32d2d]" onClick={() => deleteSupplier(s.id, s.name)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ManagerSuppliers;
