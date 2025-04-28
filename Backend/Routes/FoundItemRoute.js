const express = require('express');
const router = express.Router();
const FoundItemController = require('../controllers/FoundItemController');

// Create a new found item
router.post('/', FoundItemController.createFoundItem);

// Get all found items
router.get('/', FoundItemController.getAllFoundItems);

// Get my reported items
router.get('/my-reports', FoundItemController.getMyReports);

// Get single found item
router.get('/:id', FoundItemController.getFoundItem);

// Update found item
router.put('/:id', FoundItemController.updateFoundItem);

// Delete found item
router.delete('/:id', FoundItemController.deleteFoundItem);

// Upload image
router.post('/upload-image', FoundItemController.uploadImage);

module.exports = router; 