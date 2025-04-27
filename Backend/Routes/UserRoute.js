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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                role: user.role,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        // Return user data and token
        res.status(200).json({
            success: true,
            data: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin,
                token: token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
});

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

// export
module.exports = router;