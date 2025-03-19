console.log('Runningg');
// pass = 8sOnzmeBJSiPekJr

const express = require('express');
const mongoose = require('mongoose');
const router = require("./Routes/UserRoute");

const app = express();
const cors = require('cors');

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