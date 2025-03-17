console.log('bye World');
// pass = 8sOnzmeBJSiPekJr

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// middleware
app.use("/",(req, res, next) => {
    res.send("It is working bn");
});

mongoose.connect("mongodb+srv://jcj2:8sOnzmeBJSiPekJr@cluster1.thoez.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000); // localhost:5000 on browswer
})
.catch(err => console.log(err));