require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const InventoryLedger = require('../models/InventoryLedger');
const Order = require('../models/Order');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/RetailPro');
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    console.log('🧹 Clearing old data...');
    await User.deleteMany({});
    await Store.deleteMany({});
    await Product.deleteMany({});
    await InventoryLedger.deleteMany({});
    await Order.deleteMany({});

    console.log('🌱 Seeding Global Admin & Cashiers...');
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash('admin123', salt);
    
    // Create users dynamically
    const adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@retailpro.com',
        passwordHash: hashPwd,
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin'
    });

    const managerUser = await User.create({
        name: 'Store Manager',
        email: 'manager@retailpro.com',
        passwordHash: hashPwd,
        role: 'manager',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StoreManager'
    });
    
    const cashierUser = await User.create({
        name: 'Cy Cashier',
        email: 'cashier@retailpro.com',
        passwordHash: hashPwd,
        role: 'cashier',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyCashier'
    });

    console.log('🏢 Seeding Regional Geo-Spatial Stores...');
    const mainStore = await Store.create({
        name: 'RetailPro Flagship (NYC)',
        address: '100 Broadway, NY',
        managerId: managerUser._id,
        location: { type: 'Point', coordinates: [-74.0060, 40.7128] } // NYC Geo-Coords
    });

    const westStore = await Store.create({
        name: 'RetailPro West (LA)',
        address: '100 Sunset Blvd, CA',
        managerId: managerUser._id,
        location: { type: 'Point', coordinates: [-118.2437, 34.0522] } // LA Geo-Coords
    });

    console.log('📦 Seeding Products along with Nested Variants...');
    const teeProduct = await Product.create({
        name: 'Essential Cotton T-Shirt',
        sku: 'TEE-ESS01',
        description: 'Premium heavyweight cotton.',
        categoryId: 'apparel',
        price: 25.00,
        costPrice: 8.50,
        stock: 300, // Aggregate global stock
        storeId: mainStore._id,
        variants: [
            { sku: 'TEE-ESS01-S-BLK', size: 'S', color: 'Black', stock: 100 },
            { sku: 'TEE-ESS01-M-BLK', size: 'M', color: 'Black', stock: 100 },
            { sku: 'TEE-ESS01-L-BLK', size: 'L', color: 'Black', stock: 100 }
        ]
    });

    const techProduct = await Product.create({
        name: 'Wireless Pro Headphones',
        sku: 'AUD-PRO-01',
        description: 'Noise-canceling over-ear.',
        categoryId: 'electronics',
        price: 299.99,
        costPrice: 90.00,
        stock: 50,
        storeId: westStore._id
    });

    console.log('✅ Finalizing database entries...');
    console.log(`
    =======================================
    🚀 SEEDING COMPLETE
    =======================================
    Demo Accounts (Password: admin123)
    Admin   -> admin@retailpro.com
    Manager -> manager@retailpro.com
    Cashier -> cashier@retailpro.com
    =======================================
    `);
    process.exit(0);
};

connectDB().then(seedData);
