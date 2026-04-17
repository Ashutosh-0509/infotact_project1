import { useState, useMemo } from 'react';
import { Search, Download, CheckCircle, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import { DataTable, Column, Action } from '@/components/DataTable';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus, formatCurrency, formatDate } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; icon: any }> = {
  processing: { label: 'Processing', variant: 'secondary', icon: Package },
  completed: { label: 'Completed', variant: 'default', icon: CheckCircle },
};

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const completedOrders = useMemo(() => {
    return mockOrders.filter(o => o.status === 'completed');
  }, []);

  const filteredOrders = useMemo(() => {
    return completedOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery, completedOrders]);

  const columns: Column[] = [
    {
      key: 'orderNumber',
      label: 'Trans ID',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono font-medium text-foreground">{value}</span>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (value: Order['items']) => (
        <span className="text-muted-foreground">{value.length} items</span>
      ),
    },
    {
      key: 'total',
      label: 'Amount',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-foreground">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (value: string) => (
        <span className="capitalize text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date/Time',
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm">
          <div className="text-foreground">{formatDate(value)}</div>
          <div className="text-muted-foreground">{formatDate(value, 'time')}</div>
        </div>
      ),
    },
  ];

  const actions: Action[] = [
    {
      label: 'View Details',
      onClick: (row: Order) => {
        setSelectedOrder(row);
        setIsDetailsOpen(true);
      },
    },
  ];

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    const toastId = toast.loading('Generating Excel file...');
    try {
      const data = filteredOrders.map(order => ({
        'Trans ID': order.orderNumber,
        'Items': order.items.length,
        'Amount': order.total,
        'Payment': order.paymentMethod,
        'Date': formatDate(order.createdAt)
      }));
      
      const ws = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sales");
      
      xlsx.writeFile(wb, `RetailPro_Sales_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to export Excel.', { id: toastId });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    const toastId = toast.loading('Generating PDF file...');
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text("Retail Pro - Sales Report", 14, 22);
      
      doc.setFontSize(10);
      doc.text(`Date generated: ${new Date().toLocaleDateString()}`, 14, 30);
      
      const tableColumn = ["Trans ID", "Items", "Amount", "Payment", "Date"];
      const tableRows = filteredOrders.map(order => [
        order.orderNumber,
        order.items.length.toString(),
        formatCurrency(order.total),
        order.paymentMethod,
        formatDate(order.createdAt)
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
      
      doc.save(`RetailPro_Sales_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (e) {
      toast.error('Failed to export PDF.', { id: toastId });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const orderStats = useMemo(() => {
    const total = filteredOrders.length;
    const pending = filteredOrders.filter((o) => o.status === 'pending').length;
    const processing = filteredOrders.filter((o) => o.status === 'processing').length;
    const completed = filteredOrders.filter((o) => o.status === 'completed').length;
    const cancelled = filteredOrders.filter((o) => o.status === 'cancelled').length;
    const totalRevenue = filteredOrders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);

    return { total, pending, processing, completed, cancelled, totalRevenue };
  }, [filteredOrders]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Completed Sales</h1>
            <p className="text-muted-foreground mt-1">
              View and download your completed transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="outline" disabled={isExportingPDF} className="gap-2">
              <Download className="h-4 w-4" />
              {isExportingPDF ? 'Generating...' : 'PDF'}
            </Button>
            <Button onClick={handleExportExcel} disabled={isExportingExcel} className="gap-2">
              <Download className="h-4 w-4" />
              {isExportingExcel ? 'Generating...' : 'Excel'}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Completed Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{orderStats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(orderStats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Sales History</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search sales..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-[250px]"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredOrders}
              onRowClick={(row) => {
                setSelectedOrder(row as Order);
                setIsDetailsOpen(true);
              }}
              actions={actions}
            />
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {isDetailsOpen && selectedOrder && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">
                      Order {selectedOrder.orderNumber}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {formatDate(selectedOrder.createdAt, 'long')}
                    </DialogDescription>
                  </div>
                  <Badge variant={statusConfig[selectedOrder.status].variant} className="gap-1">
                    {(() => {
                      const Icon = statusConfig[selectedOrder.status].icon;
                      return <Icon className="h-3 w-3" />;
                    })()}
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 mt-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Payment Method</div>
                        <div className="font-medium capitalize text-foreground">
                          {selectedOrder.paymentMethod}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Created By</div>
                        <div className="text-foreground">{selectedOrder.createdBy}</div>
                      </div>
                      {selectedOrder.notes && (
                        <div>
                          <div className="text-sm text-muted-foreground">Notes</div>
                          <div className="text-foreground">{selectedOrder.notes}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-3 border-b border-border last:border-0"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{item.productName}</div>
                            <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-foreground">
                              {item.quantity} × {formatCurrency(item.price)}
                            </div>
                            {item.discount > 0 && (
                              <div className="text-sm text-destructive">
                                -{formatCurrency(item.discount)} discount
                              </div>
                            )}
                            <div className="text-sm font-semibold text-foreground">
                              {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="text-foreground">{formatCurrency(selectedOrder.tax)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="text-destructive">-{formatCurrency(selectedOrder.discount)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => window.print()}>Print Receipt</Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Layout>
  );
}
