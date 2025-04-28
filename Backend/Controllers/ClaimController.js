const Claim = require('../Model/ClaimModel');
const FoundItem = require('../models/FoundItem');

// Create a new claim
exports.createClaim = async (req, res) => {
    try {
        const { itemId, claimedBy } = req.body;
        
        // Validate required fields
        if (!itemId || !claimedBy || !claimedBy.name || !claimedBy.studentId || !claimedBy.phoneNumber) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide all required fields: itemId, claimedBy (name, studentId, phoneNumber)' 
            });
        }

        // Check if item exists
        const item = await FoundItem.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        // Check if item is already claimed
        if (item.status === 'Claimed') {
            return res.status(400).json({ success: false, error: 'This item has already been claimed' });
        }

        // Create new claim
        const claim = new Claim({
            itemId,
            reportedBy: item.finder,
            claimedBy,
            status: 'Pending'
        });

        await claim.save();
        
        // Populate the claim with user details
        const populatedClaim = await Claim.findById(claim._id)
            .populate('reportedBy', 'name email studentID')
            .populate('itemId', 'description category status');

        res.status(201).json({ success: true, data: populatedClaim });
    } catch (error) {
        console.error('Error creating claim:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to create claim' 
        });
    }
};

// Get all claims (admin only)
exports.getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate('reportedBy', 'name email studentID')
            .populate('itemId', 'description category status')
            .sort('-createdAt');
            
        res.status(200).json({ success: true, data: claims });
    } catch (error) {
        console.error('Error fetching claims:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to fetch claims' 
        });
    }
};

// Update claim status (admin only)
exports.updateClaimStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const claim = await Claim.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes },
            { new: true }
        );

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Claim not found'
            });
        }

        // If claim is approved, update the associated item's status
        if (status === 'Approved') {
            await FoundItem.findByIdAndUpdate(
                claim.itemId,
                { status: 'Claimed' },
                { new: true }
            );
        }

        res.json({
            success: true,
            data: claim
        });
    } catch (error) {
        console.error('Error updating claim status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update claim status'
        });
    }
};

exports.deleteClaim = async (req, res) => {
    try {
        const claim = await Claim.findByIdAndDelete(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Claim not found'
            });
        }

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting claim:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete claim'
        });
    }
};

// Get user's claims
exports.getUserClaims = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from the authenticated request
        const claims = await Claim.find({ claimedBy: userId })
            .populate('itemId', 'description category status foundDateTime location')
            .sort('-createdAt');
            
        res.status(200).json({ 
            success: true, 
            data: claims 
        });
    } catch (error) {
        console.error('Error fetching user claims:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to fetch user claims' 
        });
    }
}; 