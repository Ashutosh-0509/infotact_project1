const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../../src/models/Product');
const Order = require('../../src/models/Order');
const InventoryLedger = require('../../src/models/InventoryLedger');
const { createOrder } = require('../../src/controllers/orderController');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: { replSet: { count: 1 } } // Required for multi-document transactions!
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { autoIndex: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

describe('Order Controller - Transactional QA Tests', () => {
  it('Should successfully deduct stock and document ledger upon Order Creation', async () => {
    // 1. Setup Mock Product
    const fakeProduct = await Product.create({
      name: 'Mechanical Keyboard',
      sku: 'KEY-001',
      categoryId: 'electronics',
      price: 150,
      costPrice: 100,
      stock: 10,
      isActive: true
    });

    const req = {
      user: { id: new mongoose.Types.ObjectId().toHexString() },
      body: {
        orderNumber: 'ORD-TEST-1',
        subtotal: 150,
        tax: 0,
        total: 150,
        items: [
          {
            productId: fakeProduct._id.toString(),
            productName: fakeProduct.name,
            quantity: 1,
            price: 150,
            subtotal: 150
          }
        ]
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 2. Perform checkout
    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    
    // 3. Verify Stock Decrease
    const updatedProduct = await Product.findById(fakeProduct._id);
    expect(updatedProduct.stock).toBe(9); 
    
    // 4. Verify Ledger Entry
    const ledgerCount = await InventoryLedger.countDocuments();
    expect(ledgerCount).toBe(1);
    
    // 5. Verify Ledger details
    const ledger = await InventoryLedger.findOne();
    expect(ledger.type).toEqual('SALE');
    expect(ledger.previousStock).toBe(10);
    expect(ledger.newStock).toBe(9);
  });

  it('Should ABORT completely and rollback if stock is mathematically insufficient', async () => {
    // 1. Setup Mock Product (Only 2 in stock)
    const fakeProduct = await Product.create({
      name: 'Wireless Mouse',
      sku: 'MOU-001',
      categoryId: 'electronics',
      price: 50,
      costPrice: 30,
      stock: 2,
      isActive: true
    });

    const req = {
      user: { id: new mongoose.Types.ObjectId().toHexString() },
      body: {
        orderNumber: 'ORD-TEST-2',
        subtotal: 250,
        tax: 0,
        total: 250,
        items: [
          {
            productId: fakeProduct._id.toString(),
            productName: fakeProduct.name,
            quantity: 5, // Requesting 5, only 2 exist!
            price: 50,
            subtotal: 250
          }
        ]
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 2. Perform checkout (Should fail!)
    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Bad Request transaction failure
    
    // 3. Ensure NO phantom stock was decremented
    const unaffectedProduct = await Product.findById(fakeProduct._id);
    expect(unaffectedProduct.stock).toBe(2); 

    // 4. Verify Order did NOT save
    const orderCount = await Order.countDocuments();
    expect(orderCount).toBe(0);

    // 5. Verify NO Ledger log was leaked
    const ledgerCount = await InventoryLedger.countDocuments();
    expect(ledgerCount).toBe(0);
  });
});
