const User = require('../Model/UserModel');

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // Set admin status based on email
        if (email === 'security@yourdomain.com') {
            user.role = 'admin';
            user.isAdmin = true;
            await user.save();
        }

        // Log the user data for debugging
        console.log('User data before response:', {
            id: user._id,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin
        });

        // Return success response with user ID and role information
        const response = {
            status: "ok",
            userId: user._id,
            role: user.role,
            isAdmin: user.isAdmin,
            message: "Login successful"
        };

        // Log the response for debugging
        console.log('Login response:', response);

        return res.status(200).json(response);
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            status: "error",
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