const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// Pre-save middleware to ensure role and isAdmin are in sync
userSchema.pre('save', function(next) {
    if (this.role === 'admin') {
        this.isAdmin = true;
    } else if (this.isAdmin) {
        this.role = 'admin';
    }
    next();
});

module.exports = mongoose.model(
    "UserModel", // file name
    userSchema // function name
)