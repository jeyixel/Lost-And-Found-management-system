console.log('Runningg');
// pass = 8sOnzmeBJSiPekJr

const express = require('express');
const mongoose = require('mongoose');
const router = require("./Routes/UserRoute");

const app = express();
const cors = require('cors');
const UserModel = require('./Model/UserModel');

// middleware
app.use(express.json());
app.use(cors());
app.use("/users", router);

mongoose.connect("mongodb+srv://jcj2:8sOnzmeBJSiPekJr@cluster1.thoez.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000); // localhost:5000 on browswer
})
.catch(err => console.log(err));

// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({err: "User not found"});
        }
        if(user.password === password){
            return res.json({status: "ok", userId: user._id}); // sending user ID
        }else{
            return res.json({status: "Incorrect password"});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({err: "Server error"});
    }
});