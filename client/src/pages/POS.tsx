import { useState, useMemo } from 'react';
import { Search, Barcode, ShoppingCart, User, CreditCard, Banknote, Smartphone, Printer, X, Plus, Minus, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { POSCart } from '@/components/POSCart';
import { mockProducts, mockCustomers } from '@/data/mockData';
import { Product, Customer, formatCurrency, generateOrderNumber } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { springPresets } from '@/lib/motion';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

type PaymentMethod = 'cash' | 'card' | 'digital';

export default function POS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [discount, setDiscount] = useState(0);

  const categories = useMemo(() => {
    const cats = new Set(mockProducts.map(p => p.categoryId));
    return Array.from(cats);
  }, []);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.barcode?.includes(searchQuery);
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory && product.isActive && product.stock > 0;
    });
  }, [searchQuery, selectedCategory]);

  const cartTotal = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = subtotal * (discount / 100);
    const tax = (subtotal - discountAmount) * 0.1;
    const total = subtotal - discountAmount + tax;
    return { subtotal, tax, discount: discountAmount, total };
  }, [cartItems, discount]);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        updateQuantity(existingItem.id, existingItem.quantity + 1);
      }
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1,
        subtotal: product.price,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        const product = mockProducts.find(p => p.id === item.productId);
        const quantity = Math.min(newQuantity, product?.stock || 0);
        return {
          ...item,
          quantity,
          subtotal: item.price * quantity,
        };
      }
      return item;
    }));
  };

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedCustomer(null);
    setDiscount(0);
    setAmountReceived('');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowPaymentDialog(true);
  };

  const processPayment = () => {
    const orderNumber = generateOrderNumber();
    console.log('Processing payment:', {
      orderNumber,
      customer: selectedCustomer,
      items: cartItems,
      total: cartTotal,
      paymentMethod,
      amountReceived: paymentMethod === 'cash' ? parseFloat(amountReceived) : cartTotal.total,
    });

    setShowPaymentDialog(false);
    clearCart();
  };

  const change = useMemo(() => {
    if (paymentMethod !== 'cash' || !amountReceived) return 0;
    return Math.max(0, parseFloat(amountReceived) - cartTotal.total);
  }, [paymentMethod, amountReceived, cartTotal.total]);

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex gap-4 p-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <Card className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, SKU, or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button variant="outline" size="lg" className="gap-2">
                <Barcode className="h-5 w-5" />
                Scan
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setShowCustomerDialog(true)}
              >
                <User className="h-5 w-5" />
                {selectedCustomer ? selectedCustomer.name : 'Customer'}
              </Button>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mt-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all" className="px-6">All</TabsTrigger>
                {categories.map(catId => {
                  const product = mockProducts.find(p => p.categoryId === catId);
                  return (
                    <TabsTrigger key={catId} value={catId} className="px-6">
                      Category {catId.split('-')[1]}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </Card>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={springPresets.snappy}
                  >
                    <Card
                      className="p-4 cursor-pointer hover:shadow-lg transition-all active:scale-95"
                      onClick={() => addToCart(product)}
                    >
                      <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{product.sku}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(product.price)}
                        </span>
                        <Badge variant={product.stock > 10 ? 'default' : 'secondary'}>
                          {product.stock}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-96 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cartItems.length})
                </h2>
                {cartItems.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-muted-foreground"
                  >
                    <ShoppingCart className="h-16 w-16 mb-4" />
                    <p>Cart is empty</p>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={springPresets.snappy}
                    >
                      <Card className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.productName}</h4>
                            <p className="text-xs text-muted-foreground">{item.sku}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(cartTotal.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-16 h-7 text-right"
                      />
                      <span>%</span>
                      <span className="w-20 text-right">{formatCurrency(cartTotal.discount)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatCurrency(cartTotal.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(cartTotal.total)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <Card
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => {
                setSelectedCustomer(null);
                setShowCustomerDialog(false);
              }}
            >
              <div className="font-medium">Walk-in Customer</div>
              <div className="text-sm text-muted-foreground">No customer information</div>
            </Card>
            {mockCustomers.map((customer) => (
              <Card
                key={customer.id}
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setShowCustomerDialog(false);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                    <div className="text-sm text-muted-foreground">{customer.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{customer.totalOrders} orders</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(customer.totalSpent)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  className="flex flex-col gap-2 h-auto py-4"
                  onClick={() => setPaymentMethod('cash')}
                >
                  <Banknote className="h-6 w-6" />
                  <span>Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className="flex flex-col gap-2 h-auto py-4"
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Card</span>
                </Button>
                <Button
                  variant={paymentMethod === 'digital' ? 'default' : 'outline'}
                  className="flex flex-col gap-2 h-auto py-4"
                  onClick={() => setPaymentMethod('digital')}
                >
                  <Smartphone className="h-6 w-6" />
                  <span>Digital</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cartTotal.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>{formatCurrency(cartTotal.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(cartTotal.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(cartTotal.total)}</span>
              </div>
            </div>

            {paymentMethod === 'cash' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Received</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="text-lg"
                />
                {amountReceived && parseFloat(amountReceived) >= cartTotal.total && (
                  <div className="flex justify-between text-lg font-semibold text-primary">
                    <span>Change</span>
                    <span>{formatCurrency(change)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={processPayment}
              disabled={paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < cartTotal.total)}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Complete & Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}