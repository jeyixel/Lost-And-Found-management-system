const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/adminAuth');
const FoundItemController = require('../Controllers/FoundItemController');

// Admin Found Items Routes
router.get('/found-items', protect, adminOnly, FoundItemController.getAllFoundItems);
router.post('/found-items', protect, adminOnly, FoundItemController.createFoundItem);
router.put('/found-items/:id', protect, adminOnly, FoundItemController.updateFoundItem);
router.put('/found-items/:id/status', protect, adminOnly, FoundItemController.updateFoundItemStatus);
router.delete('/found-items/:id', protect, adminOnly, FoundItemController.deleteFoundItem);

module.exports = router; 