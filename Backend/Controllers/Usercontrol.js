const User = require('../Model/UserModel');


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
    return res.status(200).json({user}); // when the frontend receives this response, it accesses the data via res.data.user

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

exports.addUsers = addUsers;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;