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

exports.getAllUsers = getAllUsers;