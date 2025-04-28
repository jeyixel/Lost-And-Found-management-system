const FoundItem = require('../models/FoundItem');
const UserModel = require('../Model/UserModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('image');

// Handle image upload
exports.uploadImage = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({
        success: true,
        data: { imageUrl }
      });
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload image'
    });
  }
};

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