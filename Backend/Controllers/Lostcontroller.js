const User = require('./models/User');
const LostItem = require('./models/LostItem');

// User Controllers
const userController = {
  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const { username, email, studentId } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields
      if (username) user.username = username;
      if (email) user.email = email;
      if (studentId) user.studentId = studentId;

      await user.save();
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get user notifications
  getUserNotifications: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.notifications);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const notification = user.notifications.id(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      notification.read = true;
      await user.save();
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

// Lost Item Controllers
const lostItemController = {
  // Create new lost item
  createLostItem: async (req, res) => {
    try {
      const lostItem = new LostItem({
        ...req.body,
        reportedBy: req.user.id
      });
      await lostItem.save();
      res.status(201).json(lostItem);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get all lost items
  getAllLostItems: async (req, res) => {
    try {
      const { category, status, search } = req.query;
      let query = {};

      if (category) query.category = category;
      if (status) query.status = status;
      if (search) {
        query.$text = { $search: search };
      }

      const lostItems = await LostItem.find(query)
        .populate('reportedBy', 'username')
        .populate('foundBy', 'username')
        .populate('claimedBy', 'username')
        .sort({ createdAt: -1 });

      res.json(lostItems);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get single lost item
  getLostItem: async (req, res) => {
    try {
      const lostItem = await LostItem.findById(req.params.id)
        .populate('reportedBy', 'username')
        .populate('foundBy', 'username')
        .populate('claimedBy', 'username');

      if (!lostItem) {
        return res.status(404).json({ message: 'Lost item not found' });
      }

      res.json(lostItem);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update lost item status
  updateLostItemStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const lostItem = await LostItem.findById(req.params.id);

      if (!lostItem) {
        return res.status(404).json({ message: 'Lost item not found' });
      }

      // Check if user has permission to update status
      if (req.user.role === 'student' && lostItem.reportedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this item' });
      }

      lostItem.updateStatus(status, req.user.id);
      await lostItem.save();

      // Create notification for the reporter if item is found
      if (status === 'found') {
        const reporter = await User.findById(lostItem.reportedBy);
        reporter.notifications.push({
          message: `Your lost item "${lostItem.itemName}" has been found!`,
          type: 'found',
          itemId: lostItem._id
        });
        await reporter.save();
      }

      res.json({ message: 'Status updated successfully', lostItem });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete lost item
  deleteLostItem: async (req, res) => {
    try {
      const lostItem = await LostItem.findById(req.params.id);

      if (!lostItem) {
        return res.status(404).json({ message: 'Lost item not found' });
      }

      // Check if user has permission to delete
      if (req.user.role === 'student' && lostItem.reportedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this item' });
      }

      await lostItem.remove();
      res.json({ message: 'Lost item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = {
  userController,
  lostItemController
}; 