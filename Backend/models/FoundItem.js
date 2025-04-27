const mongoose = require('mongoose');

const FoundItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please provide item description'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Electronics', 'Clothing', 'Documents', 'Accessories', 'Books', 'Bags', 'Jewelry', 'Sports Equipment', 'Musical Instruments', 'Other']
  },
  location: {
    type: String,
    required: [true, 'Please provide where item was found'],
    trim: true
  },
  foundDateTime: {
    type: Date,
    required: [true, 'Please provide when the item was found'],
    default: Date.now
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Received', 'In Storage', 'Claimed'],
    default: 'Received'
  },
  trackingId: {
    type: String,
    unique: true
  },
  additionalDetails: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  finder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: false
  },
  claimant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    default: null
  },
  staffNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate unique item ID before saving
FoundItemSchema.pre('save', async function (next) {
  if (!this.itemId) {
    let isUnique = false;
    let newItemId;
    
    while (!isUnique) {
      // Generate ID format: FOUND-YYYYMMDD-XXXXX
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(10000 + Math.random() * 90000);
      newItemId = `FOUND-${date}-${random}`;
      
      // Check if ID exists
      const existingItem = await this.constructor.findOne({ itemId: newItemId });
      if (!existingItem) {
        isUnique = true;
      }
    }
    
    this.itemId = newItemId;
  }
  
  // Generate tracking ID if not exists
  if (!this.trackingId) {
    this.trackingId = this.itemId;
  }
  
  next();
});

// Create text index for search
FoundItemSchema.index({ description: 'text' });

module.exports = mongoose.model('FoundItem', FoundItemSchema);