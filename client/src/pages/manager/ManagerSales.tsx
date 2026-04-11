import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";

export const ManagerSales = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-black tracking-tighter">Sales Reports</h1>
           <p className="text-muted-foreground text-sm">Analyze store revenue and recent orders.</p>
         </div>
         <div className="flex gap-2">
           <select className="h-10 rounded-lg border-muted bg-card px-3 text-sm font-medium outline-none">
             <option>This Week</option>
             <option>This Month</option>
             <option>Last Quarter</option>
           </select>
           <Button 
             variant="outline"
             className="rounded-lg gap-2 font-bold h-10 px-4 border-muted hover:bg-muted"
             onClick={() => toast.success("Exporting report...")}
           >
             <Download className="w-4 h-4" /> EXPORT
           </Button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Revenue</p>
             <h3 className="text-2xl font-black text-[#1a8a3c]">₹ 4,12,000</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Orders</p>
             <h3 className="text-2xl font-black">342</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Avg Order Value</p>
             <h3 className="text-2xl font-black">₹ 1,204</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Returns</p>
             <h3 className="text-2xl font-black text-[#a32d2d]">12</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-black uppercase text-[10px]">Order ID</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Date</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Customer</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Items</TableHead>
              <TableHead className="font-black uppercase text-[10px]">Amount</TableHead>
              <TableHead className="text-right font-black uppercase text-[10px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: "#ORD-8901", date: "Oct 24, 2023", customer: "Vikram Singh", items: 3, amount: "₹ 4,500", status: "Delivered" },
              { id: "#ORD-8902", date: "Oct 24, 2023", customer: "Priya Patel", items: 1, amount: "₹ 1,299", status: "Processing" },
              { id: "#ORD-8903", date: "Oct 23, 2023", customer: "Aakash Gupta", items: 5, amount: "₹ 12,450", status: "Delivered" },
            ].map((o) => (
              <TableRow key={o.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-sm font-bold opacity-70">
                  {o.id}
                </TableCell>
                <TableCell className="text-sm">
                  {o.date}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {o.customer}
                </TableCell>
                <TableCell className="text-sm">
                  {o.items}
                </TableCell>
                <TableCell className="font-black text-[#1a8a3c]">
                  {o.amount}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={`${o.status === 'Delivered' ? 'bg-[#1a8a3c]' : 'bg-blue-500'} text-white border-none rounded-full px-3 py-0.5 hover:opacity-100 pointer-events-none`}>
                    {o.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ManagerSales;
