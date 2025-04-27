const FoundItem = require('../models/FoundItem');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { sendNotification } = require('../utils/notifications');

// @desc    Get all found items
// @route   GET /api/found-items
// @access  Public
exports.getFoundItems = asyncHandler(async (req, res, next) => {
  const foundItems = await FoundItem.find()
    .select('itemId description category location foundDateTime status trackingId')
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: foundItems.length,
    data: foundItems
  });
});

// @desc    Get single found item
// @route   GET /api/found-items/:id
// @access  Public
exports.getFoundItem = asyncHandler(async (req, res, next) => {
  const foundItem = await FoundItem.findOne({ 
    $or: [
      { _id: req.params.id },
      { itemId: req.params.id }
    ]
  });
  
  if (!foundItem) {
    return next(new ErrorResponse(`Found item not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: foundItem
  });
});

// @desc    Create new found item
// @route   POST /api/found-items
// @access  Public
exports.createFoundItem = asyncHandler(async (req, res, next) => {
  try {
    const foundItem = await FoundItem.create(req.body);
    
    sendNotification({
      title: 'New Found Item Reported',
      message: `A new item has been reported: ${foundItem.description} (ID: ${foundItem.itemId})`,
      type: 'found-item',
      itemId: foundItem._id,
      recipients: 'staff'
    });
    
    res.status(201).json({
      success: true,
      data: foundItem
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update found item
// @route   PUT /api/found-items/:id
// @access  Public
exports.updateFoundItem = asyncHandler(async (req, res, next) => {
  let foundItem = await FoundItem.findOne({ 
    $or: [
      { _id: req.params.id },
      { itemId: req.params.id }
    ]
  });
  
  if (!foundItem) {
    return next(new ErrorResponse(`Found item not found with id of ${req.params.id}`, 404));
  }
  
  foundItem = await FoundItem.findByIdAndUpdate(foundItem._id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: foundItem
  });
});

// @desc    Delete found item
// @route   DELETE /api/found-items/:id
// @access  Public
exports.deleteFoundItem = asyncHandler(async (req, res, next) => {
  const foundItem = await FoundItem.findOne({ 
    $or: [
      { _id: req.params.id },
      { itemId: req.params.id }
    ]
  });
  
  if (!foundItem) {
    return next(new ErrorResponse(`Found item not found with id of ${req.params.id}`, 404));
  }
  
  await foundItem.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get all found items
// @route   GET /api/found-items/my-items
// @access  Public
exports.getMyFoundItems = asyncHandler(async (req, res, next) => {
  const foundItems = await FoundItem.find()
    .select('itemId description category location foundDateTime status trackingId')
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: foundItems.length,
    data: foundItems
  });
});

// @desc    Mark item as in storage
// @route   PUT /api/found-items/:id/in-storage
// @access  Public
exports.markItemAsInStorage = asyncHandler(async (req, res, next) => {
  let foundItem = await FoundItem.findOne({ 
    $or: [
      { _id: req.params.id },
      { itemId: req.params.id }
    ]
  });
  
  if (!foundItem) {
    return next(new ErrorResponse(`Found item not found with id of ${req.params.id}`, 404));
  }
  
  foundItem = await FoundItem.findByIdAndUpdate(foundItem._id, 
    { status: 'In Storage', staffNotes: req.body.staffNotes || foundItem.staffNotes }, 
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: foundItem
  });
});

// @desc    Mark item as claimed
// @route   PUT /api/found-items/:id/claim
// @access  Public
exports.markItemAsClaimed = asyncHandler(async (req, res, next) => {
  let foundItem = await FoundItem.findOne({ 
    $or: [
      { _id: req.params.id },
      { itemId: req.params.id }
    ]
  });
  
  if (!foundItem) {
    return next(new ErrorResponse(`Found item not found with id of ${req.params.id}`, 404));
  }

  const updateData = { 
    status: 'Claimed', 
    staffNotes: req.body.staffNotes || foundItem.staffNotes 
  };

  foundItem = await FoundItem.findByIdAndUpdate(foundItem._id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: foundItem
  });
});

// @desc    Check for duplicate found items
// @route   POST /api/found-items/check-duplicates
// @access  Public
exports.checkForDuplicates = asyncHandler(async (req, res, next) => {
  const { description, category, location, foundDateTime } = req.body;
  
  const foundDate = new Date(foundDateTime);
  const startDate = new Date(foundDate);
  startDate.setHours(startDate.getHours() - 24);
  const endDate = new Date(foundDate);
  endDate.setHours(endDate.getHours() + 24);
  
  const potentialDuplicates = await FoundItem.find({
    category,
    foundDateTime: { $gte: startDate, $lte: endDate },
    $text: { $search: description }
  }).select('description category location foundDateTime trackingId');
  
  res.status(200).json({
    success: true,
    count: potentialDuplicates.length,
    data: potentialDuplicates
  });
});