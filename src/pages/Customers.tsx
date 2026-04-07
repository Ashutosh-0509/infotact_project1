import { useState, useMemo } from 'react';
import { Search, Plus, Mail, Phone, MapPin, TrendingUp, ShoppingBag, Award, Edit, Trash2, Eye, Filter, Download } from 'lucide-react';
import Layout from '@/components/Layout';
import { DataTable, Column, Action } from '@/components/DataTable';
import { CustomerForm } from '@/components/Forms';
import { Customer, formatCurrency, formatDate, debounce } from '@/lib/index';
import { mockCustomers, mockOrders } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

type CustomerSegment = 'all' | 'vip' | 'regular' | 'new' | 'inactive';

const getCustomerSegment = (customer: Customer): CustomerSegment => {
  if (customer.totalSpent > 2500) return 'vip';
  if (customer.totalOrders === 0) return 'inactive';
  if (customer.totalOrders <= 3) return 'new';
  return 'regular';
};

const getSegmentColor = (segment: CustomerSegment): string => {
  switch (segment) {
    case 'vip': return 'bg-primary text-primary-foreground';
    case 'new': return 'bg-accent text-accent-foreground';
    case 'inactive': return 'bg-muted text-muted-foreground';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

  const handleSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = searchQuery === '' ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      const segment = getCustomerSegment(customer);
      const matchesSegment = selectedSegment === 'all' || segment === selectedSegment;

      return matchesSearch && matchesSegment;
    });
  }, [customers, searchQuery, selectedSegment]);

  const customerStats = useMemo(() => {
    const total = customers.length;
    const vip = customers.filter(c => getCustomerSegment(c) === 'vip').length;
    const newCustomers = customers.filter(c => getCustomerSegment(c) === 'new').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

    return { total, vip, newCustomers, totalRevenue, avgOrderValue };
  }, [customers]);

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleFormSubmit = (data: Partial<Customer>) => {
    if (editingCustomer) {
      setCustomers(customers.map(c =>
        c.id === editingCustomer.id ? { ...c, ...data } : c
      ));
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: data.name || '',
        email: data.email,
        phone: data.phone || '',
        address: data.address,
        city: data.city,
        country: data.country,
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        isActive: true,
        createdAt: new Date(),
      };
      setCustomers([newCustomer, ...customers]);
    }
    setIsFormOpen(false);
  };

  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return mockOrders.filter(order => order.customerId === selectedCustomer.id);
  }, [selectedCustomer]);

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Customer',
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-muted-foreground">{customer.email || 'No email'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (customer: Customer) => (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {customer.phone}
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (customer: Customer) => (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {customer.city ? `${customer.city}, ${customer.country}` : customer.country || 'N/A'}
        </div>
      ),
    },
    {
      key: 'totalOrders',
      label: 'Orders',
      render: (customer: Customer) => (
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{customer.totalOrders}</span>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (customer: Customer) => (
        <div className="font-semibold text-primary">
          {formatCurrency(customer.totalSpent)}
        </div>
      ),
    },
    {
      key: 'loyaltyPoints',
      label: 'Points',
      render: (customer: Customer) => (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-500" />
          <span className="font-medium">{customer.loyaltyPoints || 0}</span>
        </div>
      ),
    },
    {
      key: 'segment',
      label: 'Segment',
      render: (customer: Customer) => {
        const segment = getCustomerSegment(customer);
        return (
          <Badge className={getSegmentColor(segment)}>
            {segment.toUpperCase()}
          </Badge>
        );
      },
    },
  ];

  const actions: Action[] = [
    {
      label: 'View Details',
      onClick: handleViewDetails,
    },
    {
      label: 'Edit',
      onClick: handleEditCustomer,
    },
    {
      label: 'Delete',
      onClick: (customer: Customer) => handleDeleteCustomer(customer.id),
      variant: 'destructive',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer relationships and track purchase history
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active customer base
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
              <Award className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.vip}</div>
              <p className="text-xs text-muted-foreground mt-1">
                High-value customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerStats.newCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Recent acquisitions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(customerStats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(customerStats.avgOrderValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per transaction
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>View and manage all customers</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-9"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Select value={selectedSegment} onValueChange={(value) => setSelectedSegment(value as CustomerSegment)}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredCustomers}
              onRowClick={handleViewDetails}
              actions={actions}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              {editingCustomer ? 'Update customer information' : 'Enter customer details to add them to your database'}
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            customer={editingCustomer}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                          {getInitials(selectedCustomer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <DialogTitle className="text-2xl">{selectedCustomer.name}</DialogTitle>
                        <DialogDescription className="mt-1">
                          Customer since {formatDate(selectedCustomer.createdAt, 'short')}
                        </DialogDescription>
                      </div>
                    </div>
                    <Badge className={getSegmentColor(getCustomerSegment(selectedCustomer))}>
                      {getCustomerSegment(selectedCustomer).toUpperCase()}
                    </Badge>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Order History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selectedCustomer.email && (
                            <div className="flex items-center gap-3">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedCustomer.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedCustomer.phone}</span>
                          </div>
                          {selectedCustomer.address && (
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div className="text-sm">
                                <div>{selectedCustomer.address}</div>
                                <div className="text-muted-foreground">
                                  {selectedCustomer.city}, {selectedCustomer.country}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">Purchase Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Orders</span>
                            <span className="text-sm font-semibold">{selectedCustomer.totalOrders}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Spent</span>
                            <span className="text-sm font-semibold text-primary">
                              {formatCurrency(selectedCustomer.totalSpent)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Avg Order Value</span>
                            <span className="text-sm font-semibold">
                              {formatCurrency(selectedCustomer.totalSpent / (selectedCustomer.totalOrders || 1))}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Loyalty Points</span>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-semibold">{selectedCustomer.loyaltyPoints || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                        <CardDescription>
                          {customerOrders.length} total orders
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {customerOrders.length > 0 ? (
                          <div className="space-y-3">
                            {customerOrders.map((order) => (
                              <div
                                key={order.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                              >
                                <div className="space-y-1">
                                  <div className="font-medium">{order.orderNumber}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatDate(order.createdAt, 'long')}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {order.items.length} items
                                  </div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="font-semibold text-primary">
                                    {formatCurrency(order.total)}
                                  </div>
                                  <Badge
                                    className={
                                      order.status === 'completed'
                                        ? 'bg-primary/10 text-primary'
                                        : order.status === 'processing'
                                        ? 'bg-accent text-accent-foreground'
                                        : order.status === 'cancelled'
                                        ? 'bg-destructive/10 text-destructive'
                                        : 'bg-muted text-muted-foreground'
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No orders found for this customer
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </AnimatePresence>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
