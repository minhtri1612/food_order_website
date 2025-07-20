const express = require('express');
const router = express.Router();

const profileController = require('../app/controller/ProfileController');

router.get('/', profileController.editProfile); // Route to edit profile





module.exports = router;