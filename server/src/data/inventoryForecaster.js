const cron = require('node-cron');
const Product = require('../models/Product');
const InventoryLedger = require('../models/InventoryLedger');

// Run everyday at 3:00 AM server time
const scheduleForecaster = () => {
  cron.schedule('0 3 * * *', async () => {
    console.log('[AutoForecaster] Starting nightly sales velocity prediction...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Aggregate all SALE entries in the last 30 days grouped by Product
      const salesVelocity = await InventoryLedger.aggregate([
        { 
          $match: { 
            type: 'SALE',
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: '$productId',
            totalUnitsSold: { $sum: '$quantity' }
          }
        }
      ]);

      for (const stat of salesVelocity) {
        // Daily average
        const dailyVelocity = stat.totalUnitsSold / 30;
        
        // Let's assume a static Lead Time of 7 days and a Safety Stock buffer of 5 for algorithm prototype
        const leadTimeDays = 7;
        const safetyStock = 5;

        // Forecast dynamically
        const newReorderPoint = Math.ceil((dailyVelocity * leadTimeDays) + safetyStock);

        await Product.findByIdAndUpdate(stat._id, {
          reorderPoint: newReorderPoint,
          lowStockThreshold: newReorderPoint // Sync threshold with the new algorithm point
        });
      }
      console.log(`[AutoForecaster] Successfully updated predictive thresholds for ${salesVelocity.length} products.`);

    } catch (err) {
      console.error('[AutoForecaster] Failed during nightly execution:', err);
    }
  });
};

module.exports = { scheduleForecaster };
