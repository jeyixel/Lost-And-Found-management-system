const express = require('express');
const router = express.Router();

// insert model
const User = require('../Model/UserModel');

// insert controller
const Usercontroller = require('../Controllers/Usercontrol');

router.get('/', Usercontroller.getAllUsers);
router.post('/', Usercontroller.addUsers);
router.get('/:userId', Usercontroller.getUserById); // not sure if its userId or id

// export
module.exports = router;