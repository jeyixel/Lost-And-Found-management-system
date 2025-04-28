const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { lostItemController } = require('../controller');

// Create new lost item
router.post('/', protect, lostItemController.createLostItem);

// Get all lost items
router.get('/', lostItemController.getAllLostItems);

// Get single lost item
router.get('/:id', lostItemController.getLostItem);

// Update lost item status
router.patch('/:id/status', protect, lostItemController.updateLostItemStatus);

// Delete lost item
router.delete('/:id', protect, lostItemController.deleteLostItem);

module.exports = router; 