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
import { AddEmployeeModal } from "./AddEmployeeModal";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const ManagerEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      // Filter out admin users from manager view if requested, or just show all
      const staffList = data.data.filter((u: Employee) => ['Manager', 'Cashier', 'Staff'].includes(u.role));
      setEmployees(staffList);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const deleteEmployee = async (id: string, name: string) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success(`${name} has been removed from system access`);
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-black tracking-tighter">Team Members</h1>
           <p className="text-muted-foreground text-sm">Monitor staff accounts and generate access controls.</p>
         </div>
         <AddEmployeeModal onSuccess={fetchEmployees} />
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-[400px] relative">
        {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a8a3c] mb-4" />
                <p className="font-bold text-muted-foreground text-sm">Syncing with system access controls...</p>
             </div>
          ) : employees.length === 0 ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                   <span className="text-2xl">👥</span>
                </div>
                <p className="font-black text-xl mb-1">No staff members found</p>
                <p className="text-muted-foreground text-sm">Create an employee account to grant system access.</p>
             </div>
          ) : null}

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-black uppercase text-[10px]">Name</TableHead>
              <TableHead className="font-black uppercase text-[10px]">System Access</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Email</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Registration</TableHead>
              <TableHead className="text-right font-black uppercase text-[10px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp._id} className="hover:bg-muted/50 transition-colors group">
                <TableCell className="font-bold text-sm">
                  {emp.name}
                </TableCell>
                <TableCell>
                  <Badge className={`${emp.role === 'Manager' ? 'bg-[#1a8a3c]' : 'bg-blue-600'} text-white border-none rounded-full px-3 py-0.5 pointer-events-none hover:opacity-100`}>
                    {emp.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {emp.email}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Active
                </TableCell>
                <TableCell className="text-right">
                   <div className="flex justify-end gap-2 items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#a32d2d]/10 hover:text-[#a32d2d]" onClick={() => deleteEmployee(emp._id, emp.name)}>
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

export default ManagerEmployees;
