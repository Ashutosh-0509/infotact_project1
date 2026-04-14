const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryLedger = require('../models/InventoryLedger');

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Create an order (Atomic Transaction for Stock Decrement, Ledger, Order Creation)
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create Order
    const reqBody = { ...req.body, createdBy: req.user ? req.user.id : '000000000000000000000000' };
    const order = new Order(reqBody);
    const savedOrder = await order.save({ session });

    // 2. Iterate through items to reduce stock and log ledger
    for (const item of order.items) {
      // Find Product
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product ${item.productId} not found.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${product.stock}`);
      }

      const previousStock = product.stock;
      product.stock -= item.quantity;
      await product.save({ session });

      // Create Ledger Entry
      const ledgerEntry = new InventoryLedger({
        productId: product._id,
        storeId: product.storeId, 
        type: 'SALE',
        quantity: item.quantity,
        previousStock: previousStock,
        newStock: product.stock,
        referenceId: savedOrder._id,
        notes: `Sale for Order ${savedOrder.orderNumber}`,
        createdBy: req.user ? req.user.id : '000000000000000000000000'
      });
      await ledgerEntry.save({ session });
    }

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    const orderObj = savedOrder.toObject();
    orderObj.id = orderObj._id.toString();
    
    res.status(201).json(orderObj);
  } catch (error) {
    // Abort Transaction on any failure (Phantom inventory prevention)
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(400).json({ message: 'An order with this Order Number already exists.' });
    }
    res.status(400).json({ message: 'Transaction Failed: ' + error.message });
  }
};

// Update order status
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    const orderObj = order.toObject();
    orderObj.id = orderObj._id.toString();
    res.json(orderObj);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order', error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order entirely deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
