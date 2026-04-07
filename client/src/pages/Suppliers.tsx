import { useState } from 'react';
import { Plus, Search, Building2, Phone, Mail, MapPin, DollarSign, Package, Edit, Trash2, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import { DataTable, Column, Action } from '@/components/DataTable';
import { SupplierForm } from '@/components/Forms';
import { mockSuppliers, mockProducts } from '@/data/mockData';
import { Supplier, formatCurrency, formatDate } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
  const [viewSupplier, setViewSupplier] = useState<Supplier | undefined>();

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Supplier Name',
      sortable: true,
      render: (supplier: Supplier) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{supplier.name}</div>
            <div className="text-sm text-muted-foreground">{supplier.contactPerson}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (supplier: Supplier) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{supplier.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{supplier.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (supplier: Supplier) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{supplier.city}, {supplier.country}</span>
        </div>
      ),
    },
    {
      key: 'productsSupplied',
      label: 'Products',
      render: (supplier: Supplier) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{supplier.productsSupplied.length}</span>
          <span className="text-sm text-muted-foreground">items</span>
        </div>
      ),
    },
    {
      key: 'totalPurchases',
      label: 'Total Purchases',
      sortable: true,
      render: (supplier: Supplier) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-semibold">{formatCurrency(supplier.totalPurchases)}</span>
        </div>
      ),
    },
    {
      key: 'paymentTerms',
      label: 'Payment Terms',
      render: (supplier: Supplier) => (
        <Badge variant="secondary">{supplier.paymentTerms || 'N/A'}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (supplier: Supplier) => (
        <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
          {supplier.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const actions: Action[] = [
    {
      label: 'View Details',
      onClick: (supplier: Supplier) => {
        setViewSupplier(supplier);
        setIsDetailsOpen(true);
      },
    },
    {
      label: 'Edit',
      onClick: (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsFormOpen(true);
      },
    },
    {
      label: 'Delete',
      onClick: (supplier: Supplier) => {
        if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
          setSuppliers(suppliers.filter(s => s.id !== supplier.id));
        }
      },
      variant: 'destructive',
    },
  ];

  const handleAddSupplier = () => {
    setSelectedSupplier(undefined);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: Partial<Supplier>) => {
    if (selectedSupplier) {
      setSuppliers(suppliers.map(s =>
        s.id === selectedSupplier.id ? { ...s, ...data, updatedAt: new Date() } : s
      ));
    } else {
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        ...data as Supplier,
        totalPurchases: 0,
        productsSupplied: [],
        isActive: true,
        createdAt: new Date(),
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setIsFormOpen(false);
    setSelectedSupplier(undefined);
  };

  const getSuppliedProducts = (productIds: string[]) => {
    return mockProducts.filter(p => productIds.includes(p.id));
  };

  const activeSuppliers = suppliers.filter(s => s.isActive).length;
  const totalPurchaseValue = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
              <p className="text-muted-foreground mt-1">Manage your supplier relationships and purchase history</p>
            </div>
            <Button onClick={handleAddSupplier} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Supplier
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeSuppliers} active suppliers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchase Value</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPurchaseValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all suppliers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Supplied</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {suppliers.reduce((sum, s) => sum + s.productsSupplied.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total product relationships
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Supplier Directory</CardTitle>
                  <CardDescription>View and manage all supplier information</CardDescription>
                </div>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredSuppliers}
                actions={actions}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            <DialogDescription>
              {selectedSupplier ? 'Update supplier information' : 'Enter supplier details to add to your directory'}
            </DialogDescription>
          </DialogHeader>
          <SupplierForm
            supplier={selectedSupplier}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedSupplier(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {isDetailsOpen && viewSupplier && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{viewSupplier.name}</div>
                    <div className="text-sm text-muted-foreground font-normal">{viewSupplier.contactPerson}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="history">Purchase History</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Email</div>
                            <div className="font-medium">{viewSupplier.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Phone</div>
                            <div className="font-medium">{viewSupplier.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Address</div>
                            <div className="font-medium">{viewSupplier.address}</div>
                            <div className="text-sm text-muted-foreground">{viewSupplier.city}, {viewSupplier.country}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Business Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Payment Terms</div>
                          <div className="font-medium">{viewSupplier.paymentTerms || 'Not specified'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Purchases</div>
                          <div className="font-medium text-lg">{formatCurrency(viewSupplier.totalPurchases)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Status</div>
                          <Badge variant={viewSupplier.isActive ? 'default' : 'secondary'}>
                            {viewSupplier.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Member Since</div>
                          <div className="font-medium">{formatDate(viewSupplier.createdAt, 'long')}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Products Supplied</CardTitle>
                      <CardDescription>
                        {viewSupplier.productsSupplied.length} products from this supplier
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getSuppliedProducts(viewSupplier.productsSupplied).map(product => (
                          <div key={product.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-4">
                              {product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.sku}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(product.price)}</div>
                              <div className="text-sm text-muted-foreground">Stock: {product.stock}</div>
                            </div>
                          </div>
                        ))}
                        {viewSupplier.productsSupplied.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No products assigned to this supplier
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Purchase History</CardTitle>
                      <CardDescription>Recent transactions with this supplier</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Purchase history feature coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Layout>
  );
}
