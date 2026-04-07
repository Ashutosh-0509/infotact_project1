import { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, X, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import { DataTable, Column, Action } from '@/components/DataTable';
import { mockOrders, mockCustomers } from '@/data/mockData';
import { Order, OrderStatus, formatCurrency, formatDate } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  pending: { label: 'Pending', variant: 'outline', icon: Clock },
  processing: { label: 'Processing', variant: 'secondary', icon: Package },
  completed: { label: 'Completed', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
  refunded: { label: 'Refunded', variant: 'destructive', icon: XCircle },
};

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const columns: Column[] = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono font-medium text-foreground">{value}</span>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (value: string) => (
        <span className="text-foreground">{value || 'Walk-in Customer'}</span>
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
      label: 'Total',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-foreground">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (value: string) => (
        <span className="capitalize text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: OrderStatus) => {
        const config = statusConfig[value];
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Date',
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

  const handleExport = () => {
    const csvContent = [
      ['Order Number', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].join(','),
      ...filteredOrders.map((order) =>
        [
          order.orderNumber,
          order.customerName || 'Walk-in',
          order.items.length,
          order.total,
          order.paymentMethod,
          order.status,
          formatDate(order.createdAt),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCustomerInfo = (customerId?: string) => {
    if (!customerId) return null;
    return mockCustomers.find((c) => c.id === customerId);
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all customer orders
            </p>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export Orders
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{orderStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{orderStats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{orderStats.processing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{orderStats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
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
              <CardTitle>All Orders</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-[250px]"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
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
                      <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="font-medium text-foreground">
                          {selectedOrder.customerName || 'Walk-in Customer'}
                        </div>
                      </div>
                      {selectedOrder.customerId && (() => {
                        const customer = getCustomerInfo(selectedOrder.customerId);
                        return customer ? (
                          <>
                            <div>
                              <div className="text-sm text-muted-foreground">Email</div>
                              <div className="text-foreground">{customer.email || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Phone</div>
                              <div className="text-foreground">{customer.phone}</div>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </CardContent>
                  </Card>

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
