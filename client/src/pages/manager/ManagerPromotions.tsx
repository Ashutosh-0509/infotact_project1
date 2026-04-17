import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Copy, Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";

export const ManagerPromotions = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <div>
           <h1 className="text-3xl font-black tracking-tighter">Promotions & Offers</h1>
           <p className="text-muted-foreground text-sm">Manage active, scheduled, and past promotional campaigns.</p>
         </div>
         <Button 
           className="rounded-xl gap-2 font-black h-12 px-6 bg-[#1a8a3c] hover:bg-[#1a8a3c]/90 text-white"
           onClick={() => toast.success("New promotion form opened")}
         >
           <Plus className="w-5 h-5" /> NEW PROMOTION
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Active Promo */}
         <Card className="border-none shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex flex-col flex-1">
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-bold text-lg">Diwali Mega Sale 🏮</h3>
               <Badge className="bg-[#1a8a3c] hover:bg-[#1a8a3c] text-white">Active</Badge>
             </div>
             <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
               <CalendarDays className="w-4 h-4" /> Nov 1 - Nov 15
             </p>
             <div className="bg-muted/40 p-4 rounded-xl flex justify-between items-center mb-6 mt-auto">
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Products</p>
                   <p className="font-bold">150+</p>
                </div>
                <div className="text-center border-x px-4 border-border/50">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Discount</p>
                   <p className="font-bold text-[#1a8a3c]">Up to 40%</p>
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Uses</p>
                   <p className="font-bold">842</p>
                </div>
             </div>
             <div className="flex gap-2 pt-2 border-t">
               <Button variant="ghost" size="sm" className="flex-1 gap-1 text-[#1a8a3c] hover:text-[#1a8a3c] hover:bg-[#1a8a3c]/10" onClick={() => toast("Editing Diwali Mega Sale")}><Edit className="w-4 h-4" /> Edit</Button>
               <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={() => toast("Duplicated promotion")}><Copy className="w-4 h-4" /> Dup</Button>
               <Button variant="ghost" size="sm" className="text-[#a32d2d] hover:text-[#a32d2d] hover:bg-red-50" onClick={() => toast("Removed promotion")}><Trash2 className="w-4 h-4" /></Button>
             </div>
           </CardContent>
         </Card>

         {/* Scheduled Promo */}
         <Card className="border-none shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
           <CardContent className="p-6 flex flex-col flex-1">
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-bold text-lg">Winter Clearance ❄️</h3>
               <Badge className="bg-[#e67e00] hover:bg-[#e67e00] text-white">Scheduled</Badge>
             </div>
             <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
               <CalendarDays className="w-4 h-4" /> Dec 10 - Dec 31
             </p>
             <div className="bg-muted/40 p-4 rounded-xl flex justify-between items-center mb-6 mt-auto">
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Products</p>
                   <p className="font-bold">45</p>
                </div>
                <div className="text-center border-x px-4 border-border/50">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Discount</p>
                   <p className="font-bold text-[#1a8a3c]">Flat 50%</p>
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Uses</p>
                   <p className="font-bold">-</p>
                </div>
             </div>
             <div className="flex gap-2 pt-2 border-t">
               <Button variant="ghost" size="sm" className="flex-1 gap-1 text-[#1a8a3c] hover:text-[#1a8a3c] hover:bg-[#1a8a3c]/10" onClick={() => toast("Editing Winter Clearance")}><Edit className="w-4 h-4" /> Edit</Button>
               <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={() => toast("Duplicated promotion")}><Copy className="w-4 h-4" /> Dup</Button>
               <Button variant="ghost" size="sm" className="flex-1 text-[#a32d2d] hover:text-[#a32d2d] hover:bg-red-50" onClick={() => toast("Removed promotion")}><Trash2 className="w-4 h-4" /> Rem</Button>
             </div>
           </CardContent>
         </Card>

         {/* Expired Promo */}
         <Card className="border-none shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow opacity-70">
           <CardContent className="p-6 flex flex-col flex-1">
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-bold text-lg">Summer Flash Sale ☀️</h3>
               <Badge className="bg-muted-foreground hover:bg-muted-foreground text-white">Expired</Badge>
             </div>
             <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
               <CalendarDays className="w-4 h-4" /> May 1 - May 5
             </p>
             <div className="bg-muted/40 p-4 rounded-xl flex justify-between items-center mb-6 mt-auto">
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Products</p>
                   <p className="font-bold">120</p>
                </div>
                <div className="text-center border-x px-4 border-border/50">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Discount</p>
                   <p className="font-bold text-[#1a8a3c]">20% Extra</p>
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">Uses</p>
                   <p className="font-bold">2,109</p>
                </div>
             </div>
             <div className="flex gap-2 pt-2 border-t">
               <Button variant="ghost" size="sm" className="flex-1 gap-1" onClick={() => toast("Duplicated promotion")}><Copy className="w-4 h-4" /> Duplicate</Button>
             </div>
           </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default ManagerPromotions;
