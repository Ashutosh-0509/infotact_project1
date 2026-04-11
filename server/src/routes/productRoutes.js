const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define API routes for Products
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.get('/low-stock', productController.getLowStockProducts);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
