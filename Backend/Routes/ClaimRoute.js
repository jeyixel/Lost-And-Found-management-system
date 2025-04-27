const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/adminAuth');
const ClaimController = require('../Controllers/ClaimController');

// User routes - only protect, no admin check
router.post('/', protect, ClaimController.createClaim);
router.get('/user', protect, ClaimController.getUserClaims);

// Admin routes - both protect and admin check
router.get('/', protect, adminOnly, ClaimController.getAllClaims);
router.put('/:id/status', protect, adminOnly, ClaimController.updateClaimStatus);
router.delete('/:id', protect, adminOnly, ClaimController.deleteClaim);

module.exports = router; 