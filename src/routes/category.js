const express = require('express');
const router = express.Router();

const menuController = require('../app/controller/MenuController');

router.get('/:category', menuController.menubyCategory);





module.exports = router;