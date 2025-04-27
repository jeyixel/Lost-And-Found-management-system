const FoundItem = require('../models/FoundItem');
const UserModel = require('../Model/UserModel');

// Generate a unique item ID
const generateItemId = async () => {
  let isUnique = false;
  let newItemId;
  
  while (!isUnique) {
    // Generate ID format: FOUND-YYYYMMDD-XXXXX
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    newItemId = `FOUND-${date}-${random}`;
    
    // Check if ID exists
    const existingItem = await FoundItem.findOne({ itemId: newItemId });
    if (!existingItem) {
      isUnique = true;
    }
  }
  
  return newItemId;
};

// Create a new found item
exports.createFoundItem = async (req, res) => {
    try {
        // Validate required fields
        const { description, category, location } = req.body;
        if (!description || !category || !location) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields: description, category, and location'
            });
        }

        // Generate unique item ID
        const itemId = await generateItemId();

        // Create new item
        const foundItem = new FoundItem({
            itemId,
            description,
            category,
            location,
            foundDateTime: req.body.foundDateTime || new Date(),
            imageUrl: req.body.imageUrl || '',
            status: 'Received',
            additionalDetails: req.body.additionalDetails || '',
            isPublic: true,
            finder: req.body.finder || null,
            trackingId: itemId // Use the same ID for tracking
        });

        // Save the item
        await foundItem.save();

        res.status(201).json({
            success: true,
            data: foundItem
        });
    } catch (error) {
        console.error('Error creating found item:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to create found item'
        });
    }
};

// Get all found items
exports.getAllFoundItems = async (req, res) => {
    try {
        const foundItems = await FoundItem.find()
            .populate('finder', 'name email studentID')
            .sort('-createdAt');
        res.status(200).json({
            success: true,
            count: foundItems.length,
            data: foundItems
        });
    } catch (error) {
        console.error('Error fetching found items:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch found items'
        });
    }
};

// Get my reported items
exports.getMyReports = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const foundItems = await FoundItem.find({ finder: userId })
            .populate('finder', 'name email studentID');
        res.status(200).json({
            success: true,
            count: foundItems.length,
            data: foundItems
        });
    } catch (error) {
        console.error('Error fetching user reports:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch user reports'
        });
    }
};

// Get single found item
exports.getFoundItem = async (req, res) => {
    try {
        const foundItem = await FoundItem.findById(req.params.id)
            .populate('finder', 'name email studentID');
        if (!foundItem) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        res.status(200).json({
            success: true,
            data: foundItem
        });
    } catch (error) {
        console.error('Error fetching found item:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch found item'
        });
    }
};

// Update found item
exports.updateFoundItem = async (req, res) => {
    try {
        const item = await FoundItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        // Check if the user is an admin
        const user = req.user;
        if (!user || !user.isAdmin) {
            // For non-admin users, check if item is in storage or claimed
            if (item.status === 'In Storage' || item.status === 'Claimed') {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Cannot update items that are in storage or claimed' 
                });
            }
        }

        const updatedItem = await FoundItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ success: false, error: 'Failed to update item' });
    }
};

// Delete found item
exports.deleteFoundItem = async (req, res) => {
    try {
        const item = await FoundItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        // Check if the user is an admin
        const user = req.user;
        if (!user || !user.isAdmin) {
            // For non-admin users, check if item is in storage or claimed
            if (item.status === 'In Storage' || item.status === 'Claimed') {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Cannot delete items that are in storage or claimed' 
                });
            }
        }

        await FoundItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ success: false, error: 'Failed to delete item' });
    }
};

// Admin: Update item status
exports.updateFoundItemStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status is required'
            });
        }

        const foundItem = await FoundItem.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!foundItem) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: foundItem
        });
    } catch (error) {
        console.error('Error updating item status:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update item status'
        });
    }
}; 