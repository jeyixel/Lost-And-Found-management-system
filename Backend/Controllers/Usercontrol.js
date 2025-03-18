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

}

exports.addUsers = addUsers;
exports.getAllUsers = getAllUsers;