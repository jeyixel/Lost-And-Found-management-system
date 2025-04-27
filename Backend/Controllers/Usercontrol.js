const User = require('../Model/UserModel');
const jwt = require('jsonwebtoken');

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt:', { email, password });
        
        // Find user by email
        const user = await User.findOne({ email });
        console.log('Found user:', user ? {
            email: user.email,
            password: user.password,
            role: user.role,
            isAdmin: user.isAdmin
        } : 'User not found');
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        console.log('Password comparison:', {
            inputPassword: password,
            storedPassword: user.password,
            match: user.password === password
        });

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Set admin status based on email
        if (email === 'security@yourdomain.com') {
            user.role = 'admin';
            user.isAdmin = true;
            await user.save();
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

        // Return success response with user data and token
        return res.status(200).json({
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
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// display all users
const getAllUsers = async (req, res) => {
    let Users; // declare a variable to store all users
    
    // get all users
    try {
        Users = await User.find();
    } catch (err) {
        console.log(err);
    }

    // not found
    if (!Users) {
        return res.status(404).json({message: "No users found"});
    }

    // display all users
    return res.status(200).json({Users});

};

// data insertion
const addUsers = async (req, res, next) => {
    const {name, studentID, email, password, phoneNumber} = req.body;
    
    let users;

    try{
        users = new User({name, studentID, email, password, phoneNumber});
        await users.save();
    }catch(err){
        console.log(err);
    }

    // if no users were added
    if(!users){
        return res.status(404).json({message: "No users added"});
    }
    return res.status(200).json({users});

};

// get data by ID
const getUserById = async (req, res, next) => {
    const userId = req.params.userId; // changed from id to userId
    let user;

    try{
        user = await User.findById(userId);
    }catch(err){
        console.log(err);
    }

    if(!user){
        return res.status(404).json({message: "No user found"});
    }
    return res.status(200).json({user});

}

// Update user details
const updateUser = async (req, res, next) => {
    const userId = req.params.userId;
    const {name, studentID, email, password, phoneNumber} = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(userId, {name, studentID, email, password, phoneNumber});
        users = await users.save();
    }catch(err){
        console.log(err);
    }

    if(!users){
        return res.status(404).json({message: "Unable to edit user"});
    }
    return res.status(200).json({users});
};

// delete user details
const deleteUser = async (req, res, next) => {
    const userId = req.params.userId;
    let users;

    try{
        users = await User.findByIdAndDelete(userId);
    }catch(err){
        console.log(err);
    }

    if(!users){
        return res.status(404).json({message: "Unable to delete user"});
    }
    return res.status(200).json({users});

}

// Update admin user
const updateAdminUser = async (req, res) => {
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
};

exports.addUsers = addUsers;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
exports.updateAdminUser = updateAdminUser;