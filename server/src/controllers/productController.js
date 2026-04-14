const Product = require('../models/Product');
const Redis = require('ioredis');

// Setup Redis instance (gracefully fail if Redis is down for local dev)
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  lazyConnect: true,
  maxRetriesPerRequest: 1
});
redis.on('error', (err) => console.warn('Redis connection warned:', err.message));

// Helper: Clear product cache
const clearCache = async () => {
  try {
    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    // Ignore if redis is unavailable
  }
};

// Get all products (with Cursor pagination, Text search, Redis cache)
exports.getProducts = async (req, res) => {
  try {
    const { cursor, limit, q } = req.query;
    const fetchLimit = parseInt(limit) || 50;
    
    // Construct unique cache key
    const cacheKey = `products:${cursor || '0'}:${fetchLimit}:${q || ''}`;
    
    // Attempt Redis fetch
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (cacheErr) {
       // Redis failed/offline, proceed to Mongo natively
    }

    let query = { isActive: true };
    
    // Full-Text Search integration (Week 2 req)
    if (q) {
      query.$text = { $search: q };
    }
    
    // Cursor pagination (assuming cursor is ID)
    if (cursor) {
      query._id = { $gt: cursor };
    }

    const products = await Product.find(query)
      .sort({ _id: 1 }) // Crucial for cursor pagination
      .limit(fetchLimit);

    const nextCursor = products.length === fetchLimit ? products[products.length - 1]._id : null;
    
    const responseData = { products, nextCursor };

    // Set Cache for 10 minutes
    try {
      if (redis.status === 'ready') {
         await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 600);
      }
    } catch (e) {}

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    
    await clearCache(); // Invalidate Cache
    
    // Add id field for frontend compatibility
    const productObj = savedProduct.toObject();
    productObj.id = productObj._id.toString();
    
    res.status(201).json(productObj);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A product with this SKU already exists.' });
    }
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const productObj = product.toObject();
    productObj.id = productObj._id.toString();
    res.json(productObj);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get low stock alerts
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true,
      $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    }).sort({ stock: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock alerts', error: error.message });
  }
};
