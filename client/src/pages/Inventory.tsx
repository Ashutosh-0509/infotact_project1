import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Download,
  Search,
  MapPin,
  Calendar,
  Edit,
  Trash2,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { DataTable, Column, Action } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Product,
  StockAdjustment,
  StockAdjustmentType,
  formatDate,
  getStockStatus,
} from '@/lib/index';
import { mockProducts, mockStockAdjustments } from '@/data/mockData';

type StockStatusFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
type LocationFilter = 'all' | 'warehouse-a' | 'warehouse-b' | 'store-front';

interface StockAdjustmentForm {
  productId: string;
  type: StockAdjustmentType;
  quantity: number;
  reason: string;
  location: string;
}

export default function Inventory() {
  const [products] = useState<Product[]>(mockProducts);
  const [adjustments] = useState<StockAdjustment[]>(mockStockAdjustments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatusFilter>('all');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState<StockAdjustmentForm>({
    productId: '',
    type: 'in',
    quantity: 0,
    reason: '',
    location: 'warehouse-a',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const status = getStockStatus(product);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((adjustment) => {
      if (locationFilter === 'all') return true;
      const adjustmentLocation = adjustment.location?.toLowerCase().replace(/\s+/g, '-');
      return adjustmentLocation === locationFilter;
    });
  }, [adjustments, locationFilter]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter((p) => getStockStatus(p) === 'low-stock').length;
    const outOfStockCount = products.filter((p) => getStockStatus(p) === 'out-of-stock').length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    return {
      totalProducts,
      totalStock,
      lowStockCount,
      outOfStockCount,
      totalValue,
    };
  }, [products]);

  const getStockStatusBadge = (product: Product) => {
    const status = getStockStatus(product);
    const variants: Record<typeof status, 'default' | 'destructive' | 'secondary'> = {
      'in-stock': 'default',
      'low-stock': 'secondary',
      'out-of-stock': 'destructive',
    };
    const labels: Record<typeof status, string> = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getAdjustmentTypeBadge = (type: StockAdjustmentType) => {
    const variants: Record<StockAdjustmentType, 'default' | 'destructive' | 'secondary'> = {
      in: 'default',
      out: 'secondary',
      adjustment: 'secondary',
      return: 'default',
      damage: 'destructive',
    };
    const labels: Record<StockAdjustmentType, string> = {
      in: 'Stock In',
      out: 'Stock Out',
      adjustment: 'Adjustment',
      return: 'Return',
      damage: 'Damage',
    };
    return <Badge variant={variants[type]}>{labels[type]}</Badge>;
  };

  const inventoryColumns: Column[] = [
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
    },
    {
      key: 'stock',
      label: 'Current Stock',
      sortable: true,
      render: (value: number, row: Product) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          <span className="text-muted-foreground text-sm">{row.unit}</span>
        </div>
      ),
    },
    {
      key: 'lowStockThreshold',
      label: 'Min. Stock',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_value: unknown, row: Product) => getStockStatusBadge(row),
    },
    {
      key: 'price',
      label: 'Unit Price',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      sortable: true,
      render: (_value: unknown, row: Product) => `$${(row.price * row.stock).toFixed(2)}`,
    },
  ];

  const adjustmentColumns: Column[] = [
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: Date) => formatDate(value, 'short'),
    },
    {
      key: 'productName',
      label: 'Product',
      sortable: true,
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: StockAdjustmentType) => getAdjustmentTypeBadge(value),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      render: (value: number, row: StockAdjustment) => (
        <div className="flex items-center gap-1">
          {row.type === 'in' || row.type === 'return' ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'previousStock',
      label: 'Previous',
      sortable: true,
    },
    {
      key: 'newStock',
      label: 'New Stock',
      sortable: true,
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
    },
  ];

  const inventoryActions: Action[] = [
    {
      label: 'Adjust Stock',
      onClick: (row: Product) => {
        setAdjustmentForm({
          productId: row.id,
          type: 'in',
          quantity: 0,
          reason: '',
          location: 'warehouse-a',
        });
        setIsAdjustmentDialogOpen(true);
      },
    },
  ];

  const handleAdjustmentSubmit = () => {
    console.log('Stock adjustment submitted:', adjustmentForm);
    setIsAdjustmentDialogOpen(false);
    setAdjustmentForm({
      productId: '',
      type: 'in',
      quantity: 0,
      reason: '',
      location: 'warehouse-a',
    });
  };

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
              <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
              <p className="text-muted-foreground mt-1">
                Track stock levels, manage warehouse locations, and monitor adjustments
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => setIsAdjustmentDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Stock Adjustment
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">Active SKUs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStock}</div>
              <p className="text-xs text-muted-foreground mt-1">Units in inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.lowStockCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Items need reorder</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.outOfStockCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Items unavailable</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Inventory worth</p>
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
              <CardTitle>Current Inventory</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StockStatusFilter)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={inventoryColumns} data={filteredProducts} actions={inventoryActions} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Stock Adjustment History</CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <Select value={locationFilter} onValueChange={(value) => setLocationFilter(value as LocationFilter)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                    <SelectItem value="store-front">Store Front</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={adjustmentColumns} data={filteredAdjustments} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={isAdjustmentDialogOpen} onOpenChange={setIsAdjustmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
            <DialogDescription>
              Add or remove stock for a product. All adjustments are logged for audit purposes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={adjustmentForm.productId}
                onValueChange={(value) => setAdjustmentForm({ ...adjustmentForm, productId: value })}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Adjustment Type</Label>
              <Select
                value={adjustmentForm.type}
                onValueChange={(value) => setAdjustmentForm({ ...adjustmentForm, type: value as StockAdjustmentType })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="damage">Damage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={adjustmentForm.quantity}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={adjustmentForm.location}
                onValueChange={(value) => setAdjustmentForm({ ...adjustmentForm, location: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                  <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  <SelectItem value="store-front">Store Front</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for adjustment..."
                value={adjustmentForm.reason}
                onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjustmentSubmit}>Submit Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
