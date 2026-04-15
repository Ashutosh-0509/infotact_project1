require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { scheduleForecaster } = require('./data/inventoryForecaster');

// Connect to MongoDB
connectDB();

// Initialize nightly forecasting CRON
scheduleForecaster();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Swagger Configuration ──────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RetailPro API',
      version: '1.0.0',
      description: 'API documentation for RetailPro POS system',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for development
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);

// Health-check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  POS Server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
