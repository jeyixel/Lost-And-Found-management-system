const express = require('express');
const router = express.Router();
const { 
  getFoundItems, 
  getFoundItem, 
  createFoundItem, 
  updateFoundItem, 
  deleteFoundItem,
  getMyFoundItems,
  markItemAsInStorage,
  markItemAsClaimed,
  checkForDuplicates
} = require('../controllers/foundItems');

// Public routes
router.route('/')
  .get(getFoundItems)
  .post(createFoundItem);

router.route('/:id')
  .get(getFoundItem)
  .put(updateFoundItem)
  .delete(deleteFoundItem);

router.route('/:id/in-storage')
  .put(markItemAsInStorage);

router.route('/:id/claim')
  .put(markItemAsClaimed);

router.route('/check-duplicates')
  .post(checkForDuplicates);

module.exports = router;