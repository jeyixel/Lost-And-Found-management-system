console.log('Runningg');
// pass = 8sOnzmeBJSiPekJr

const express = require('express');
const mongoose = require('mongoose');
const userRouter = require("./Routes/UserRoute");
const foundItemRouter = require("./routes/FoundItemRoute");

const app = express();
const cors = require('cors');
const UserModel = require('./Model/UserModel');

// middleware
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/found-items", foundItemRouter);

mongoose.connect("mongodb+srv://jcj2:8sOnzmeBJSiPekJr@cluster1.thoez.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000); // localhost:5000 on browswer
})
.catch(err => console.log(err));

// login
// app.js (excerpt)

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Find the user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.json({ status: "error", err: "User not found" });
      }
  
      // 2. Check password
      if (user.password !== password) {
        return res.json({ status: "error", err: "Incorrect password" });
      }
  
      // 3. At this point credentials are valid.
      //    Send back the role so the front-end can branch
      return res.json({
        status: "ok",
        userId: user._id,
        role:   user.role || "student"  // default if missing
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: "Server error" });
    }
  });
  

// app.use('/admin', requireAdmin, (req, res) => {
//     res.send('Admin route protected');
// });