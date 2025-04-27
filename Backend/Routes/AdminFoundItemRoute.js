const express = require('express');
const router = express.Router();
const FoundItemController = require('../controllers/FoundItemController');
const { protect, adminOnly } = require('../middleware/adminAuth');

// Apply admin middleware to all routes
router.use(protect);
router.use(adminOnly);

// Get all found items
router.get('/', FoundItemController.getAllFoundItems);

// Create a new found item
router.post('/', FoundItemController.createFoundItem);

// Update item status
router.put('/:id/status', FoundItemController.updateFoundItemStatus);

// Update found item
router.put('/:id', FoundItemController.updateFoundItem);

// Delete found item
router.delete('/:id', FoundItemController.deleteFoundItem);

module.exports = router; 