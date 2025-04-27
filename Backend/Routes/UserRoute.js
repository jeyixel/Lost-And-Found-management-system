const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// insert model
const User = require('../Model/UserModel');

// insert controller
const Usercontroller = require('../Controllers/Usercontrol');

// Define routes
router.get('/', Usercontroller.getAllUsers);
router.post('/', Usercontroller.addUsers);

// Login route
router.post('/login', Usercontroller.loginUser);

// Check admin status
router.get('/check-admin', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                isAdmin: user.isAdmin,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Check admin error:', error);
        res.status(500).json({
            success: false,
            message: "Error checking admin status"
        });
    }
});

router.post('/update-admin', async (req, res) => {
    try {
        const adminUser = await User.findOne({ email: 'security@yourdomain.com' });
        if (adminUser) {
            adminUser.role = 'admin';
            adminUser.isAdmin = true;
            await adminUser.save();
            return res.status(200).json({
                status: "ok",
                message: "Admin user updated successfully"
            });
        }
        return res.status(404).json({
            status: "error",
            message: "Admin user not found"
        });
    } catch (err) {
        console.error('Update admin error:', err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});

router.get('/:userId', Usercontroller.getUserById);
router.put('/:userId', Usercontroller.updateUser);
router.delete('/:userId', Usercontroller.deleteUser);

// Check admin user
router.get('/debug/admin', async (req, res) => {
    try {
        const adminUser = await User.findOne({ email: 'security@yourdomain.com' });
        if (adminUser) {
            return res.status(200).json({
                success: true,
                data: {
                    email: adminUser.email,
                    role: adminUser.role,
                    isAdmin: adminUser.isAdmin
                }
            });
        }
        return res.status(404).json({
            success: false,
            message: "Admin user not found"
        });
    } catch (err) {
        console.error('Debug admin error:', err);
        return res.status(500).json({
            success: false,
            message: "Error checking admin user"
        });
    }
});

// Create or update admin user
router.post('/debug/set-admin', async (req, res) => {
    try {
        const adminUser = await User.findOne({ email: 'security@yourdomain.com' });
        
        if (adminUser) {
            // Update existing admin user
            adminUser.password = 'admin123';
            adminUser.role = 'admin';
            adminUser.isAdmin = true;
            await adminUser.save();
        } else {
            // Create new admin user
            const newAdmin = new User({
                name: 'Admin User',
                studentID: 'ADMIN001',
                email: 'security@yourdomain.com',
                password: 'admin123',
                phoneNumber: '1234567890',
                role: 'admin',
                isAdmin: true
            });
            await newAdmin.save();
        }

        return res.status(200).json({
            success: true,
            message: "Admin user created/updated successfully"
        });
    } catch (err) {
        console.error('Set admin error:', err);
        return res.status(500).json({
            success: false,
            message: "Error creating/updating admin user"
        });
    }
});

// export
module.exports = router;