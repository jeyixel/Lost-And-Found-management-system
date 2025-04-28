console.log('Runningg');
// pass = 8sOnzmeBJSiPekJr

const express = require('express');
const mongoose = require('mongoose');
const userRouter = require("./Routes/UserRoute");
const foundItemRouter = require("./routes/FoundItemRoute");
const adminRouter = require("./Routes/AdminRoute");
const adminFoundItemRouter = require("./Routes/AdminFoundItemRoute");
const claimRouter = require("./Routes/ClaimRoute");
const cors = require('cors');

const app = express();

// middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// routes
app.use("/users", userRouter);
app.use("/found-items", foundItemRouter);
app.use("/admin", adminRouter);
app.use("/admin/found-items", adminFoundItemRouter);
app.use("/admin/claims", claimRouter);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect("mongodb+srv://jcj2:8sOnzmeBJSiPekJr@cluster1.thoez.mongodb.net/")
    .then(() => console.log("Connected to MongoDB"))
    .then(() => {
        app.listen(5000, () => {
            console.log("Server is running on port 5000");
        });
    })
    .catch(err => console.log("MongoDB connection error:", err));