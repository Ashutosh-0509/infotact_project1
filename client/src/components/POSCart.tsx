import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Wallet, Smartphone, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency, type PaymentMethod } from '@/lib/index';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  discount: number;
  subtotal: number;
}

interface POSCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function POSCart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: POSCartProps) {
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const TAX_RATE = 0.1;

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax;

  const handleQuantityChange = (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const paymentIcons = {
    cash: Wallet,
    card: CreditCard,
    digital: Smartphone,
    split: CreditCard,
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Current Order</h2>
            <p className="text-sm text-muted-foreground">{items.length} items</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">Cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">Add products to start a sale</p>
            </motion.div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="bg-background rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.productName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-12 text-center font-medium text-foreground">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} each</p>
                    <p className="font-semibold text-foreground">{formatCurrency(item.subtotal)}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Discount Section */}
      {items.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="discount" className="text-sm font-medium">Discount (%)</Label>
          </div>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
            className="h-9"
            placeholder="0"
          />
        </div>
      )}

      {/* Payment Method */}
      {items.length > 0 && (
        <div className="p-4 border-t border-border">
          <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
            <div className="grid grid-cols-2 gap-2">
              {(['cash', 'card', 'digital', 'split'] as PaymentMethod[]).map((method) => {
                const Icon = paymentIcons[method];
                return (
                  <div key={method} className="relative">
                    <RadioGroupItem value={method} id={method} className="peer sr-only" />
                    <Label
                      htmlFor={method}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-border bg-background cursor-pointer transition-all hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{method}</span>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Summary */}
      {items.length > 0 && (
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount ({discountPercent}%)</span>
                <span className="font-medium text-destructive">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Complete Sale
          </Button>
        </div>
      )}
    </div>
  );
}
