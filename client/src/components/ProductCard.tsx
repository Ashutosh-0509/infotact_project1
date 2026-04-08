import { Product, formatCurrency, getStockStatus } from '@/lib/index';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const stockStatus = getStockStatus(product);
  
  const stockBadgeVariant = {
    'in-stock': 'default',
    'low-stock': 'secondary',
    'out-of-stock': 'destructive',
  } as const;

  const stockBadgeText = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock',
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={stockBadgeVariant[stockStatus]}>
              {stockBadgeText[stockStatus]}
            </Badge>
          </div>
          {!product.isActive && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary">Inactive</Badge>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
              {product.costPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.costPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Stock:</span>
              <span className={`font-medium ${
                stockStatus === 'out-of-stock' ? 'text-destructive' :
                stockStatus === 'low-stock' ? 'text-secondary-foreground' :
                'text-foreground'
              }`}>
                {product.stock} {product.unit}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit?.(product)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete?.(product.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}