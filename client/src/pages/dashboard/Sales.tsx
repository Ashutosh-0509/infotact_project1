import { useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Sales() {
  const [filter, setFilter] = useState('Today');

  const stats = [
    { title: "Today's Sales", value: "₹45,230", icon: DollarSign, trend: "+12.5%", color: "text-green-400" },
    { title: "Weekly Revenue", value: "₹2,84,500", icon: TrendingUp, trend: "+8.2%", color: "text-blue-400" },
    { title: "Monthly Total", value: "₹12,45,000", icon: Calendar, trend: "+15.3%", color: "text-purple-400" },
    { title: "Total Transactions", value: "1,240", icon: ShoppingBag, trend: "+5.1%", color: "text-orange-400" },
  ];

  const sales = [
    { id: "#T89341", items: 4, amount: "₹1,250", method: "UPI", status: "Completed", time: "2:30 PM" },
    { id: "#T89342", items: 2, amount: "₹850", method: "Cash", status: "Completed", time: "2:45 PM" },
    { id: "#T89343", items: 1, amount: "₹450", method: "Card", status: "Completed", time: "3:00 PM" },
    { id: "#T89344", items: 6, amount: "₹2,100", method: "UPI", status: "Completed", time: "3:15 PM" },
    { id: "#T89345", items: 3, amount: "₹600", method: "Cash", status: "Completed", time: "3:30 PM" },
  ];

  const handleExportExcel = async () => {
    const toastId = toast.loading('Generating Excel file...');
    try {
      const data = sales.map(item => ({
        'Trans ID': item.id,
        'Items': item.items,
        'Amount': item.amount,
        'Payment': item.method,
        'Status': item.status,
        'Date/Time': item.time
      }));
      
      const ws = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sales");
      
      xlsx.writeFile(wb, `Sales_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to export Excel.', { id: toastId });
    }
  };

  const handleExportPDF = async () => {
    const toastId = toast.loading('Generating PDF file...');
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Retail Pro - Sales Report", 14, 22);
      doc.setFontSize(10);
      doc.text(`Date generated: ${new Date().toLocaleDateString()}`, 14, 30);
      
      const tableColumn = ["Trans ID", "Items", "Amount", "Payment", "Status", "Date/Time"];
      const tableRows = sales.map(item => [
        item.id,
        item.items?.toString() || '0',
        item.amount,
        item.method,
        item.status,
        item.time
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 38,
        didDrawPage: function (data) {
          doc.setFontSize(10);
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text("Confidential - Retail Pro POS", data.settings.margin.left, pageHeight - 10);
        }
      });
      
      doc.save(`Sales_Export_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to export PDF.', { id: toastId });
    }
  };

  return (
    <div className="theme-neon-blue">
      <Layout>
        <div className="space-y-8 pb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase border-l-4 border-primary pl-4">SALES</h1>
            <div className="flex gap-2 bg-card/50 p-1 rounded-xl border border-primary/10">
              {['Today', 'Week', 'Month', 'Custom'].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-4 ${filter === f ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'text-muted-foreground'}`}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-black/20 border border-primary/20 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)] transition-all`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">{stat.trend}</Badge>
              </div>
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">{stat.title}</p>
              <h3 className="text-3xl font-black mt-1 tracking-tight">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by Trans ID or customer..."
                className="pl-10 bg-black/20 border-primary/10 focus:border-primary/40 rounded-xl"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-primary/10 hover:bg-primary/5 rounded-xl gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary/10 hover:bg-primary/5 rounded-xl gap-2">
                    <Download className="w-4 h-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-xl border-primary/20 rounded-xl overflow-hidden shadow-2xl">
                  <DropdownMenuItem onClick={handleExportPDF} className="px-4 py-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10 focus:text-primary">Download PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel} className="px-4 py-2 cursor-pointer font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10 focus:text-primary">Download Excel (.xlsx)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/10">
                  {['Trans ID', 'Items', 'Amount', 'Method', 'Status', 'Date/Time', ''].map((h) => (
                    <th key={h} className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.map((item, i) => (
                  <tr key={i} className="border-b border-primary/5 hover:bg-primary/5 transition-colors group cursor-pointer">
                    <td className="px-8 py-6 font-mono text-sm text-primary">{item.id}</td>
                    <td className="px-8 py-6">{item.items}</td>
                    <td className="px-8 py-6 font-black text-lg">{item.amount}</td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="rounded-lg border-primary/10">{item.method}</Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase shadow-sm ${item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                          item.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                            'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Completed' ? 'bg-green-400' :
                            item.status === 'Pending' ? 'bg-yellow-400' :
                              'bg-red-400'
                          }`} />
                        {item.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-muted-foreground">{item.time}</td>
                    <td className="px-8 py-6">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-full">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-primary/10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Showing 1-5 of 1,240 transactions</p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-xl border-primary/10 hover:bg-primary/5"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="rounded-xl border-primary/10 hover:bg-primary/5 bg-primary/10 text-primary">1</Button>
              <Button variant="outline" size="icon" className="rounded-xl border-primary/10 hover:bg-primary/5">2</Button>
              <Button variant="outline" size="icon" className="rounded-xl border-primary/10 hover:bg-primary/5"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
