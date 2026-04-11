const Promotion = require('../models/Promotion');

exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({ isActive: true }).sort({ startDate: 1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promotions', error: error.message });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    const savedPromo = await promotion.save();
    
    const promoObj = savedPromo.toObject();
    promoObj.id = promoObj._id.toString();
    
    res.status(201).json(promoObj);
  } catch (error) {
    res.status(400).json({ message: 'Error creating promotion', error: error.message });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    
    const promoObj = promotion.toObject();
    promoObj.id = promoObj._id.toString();
    res.json(promoObj);
  } catch (error) {
    res.status(400).json({ message: 'Error updating promotion', error: error.message });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    // Soft delete
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json({ message: 'Promotion deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting promotion', error: error.message });
  }
};
