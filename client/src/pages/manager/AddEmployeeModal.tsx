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

interface AddEmployeeModalProps {
  onSuccess: () => void;
}

export function AddEmployeeModal({ onSuccess }: AddEmployeeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/users", formData);
      toast.success("Employee successfully added to system!");
      setOpen(false);
      onSuccess(); // Trigger refresh
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "Staff",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl gap-2 font-black h-12 px-6 bg-[#1a8a3c] hover:bg-[#1a8a3c]/90 text-white">
          <Plus className="w-5 h-5" /> ADD EMPLOYEE
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Register New System Employee</DialogTitle>
          <DialogDescription>
            Create an account enabling POS or Manager access for a staff member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">Full Name</Label>
            <Input 
              id="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              placeholder="e.g. Maya Sharma"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input 
              id="email" 
              type="email"
              required 
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              placeholder="maya@retailpro.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="font-bold">System Role</Label>
              <select 
                id="role" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({...prev, role: e.target.value}))}
              >
                <option value="Staff">Staff</option>
                <option value="Cashier">Cashier</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">Temp Password</Label>
              <Input 
                id="password" 
                type="password"
                required 
                value={formData.password}
                onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
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
              Create Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
