const express = require('express');
const router = express.Router();

// insert model
const User = require('../Model/UserModel');

// insert controller
const Usercontroller = require('../Controllers/Usercontrol');

router.get('/', Usercontroller.getAllUsers);

// export
module.exports = router;