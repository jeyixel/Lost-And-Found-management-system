const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    lastSeenLocation: {
      type: String,
      required: true,
      trim: true,
    },
    dateLost: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Books",
        "Clothing",
        "Accessories",
        "Documents",
        "Others",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "found", "claimed"],
      default: "pending",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String, // URL to the uploaded image
      required: false,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    foundBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    claimDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Add text index for search functionality
lostItemSchema.index({
  itemName: "text",
  description: "text",
  lastSeenLocation: "text",
});

// Instance method to check if item can be claimed
lostItemSchema.methods.canBeClaimed = function () {
  return this.status === "found" && !this.claimedBy;
};

// Instance method to update status
lostItemSchema.methods.updateStatus = function (newStatus, userId = null) {
  this.status = newStatus;
  if (newStatus === "found" && userId) {
    this.foundBy = userId;
  } else if (newStatus === "claimed" && userId) {
    this.claimedBy = userId;
    this.claimDate = new Date();
  }
};

// Prevent overwriting the model
const LostItem =
  mongoose.models.LostItem || mongoose.model("LostItem", lostItemSchema);

module.exports = LostItem;
