const express = require('express');
const router = express.Router();
const homeController = require('../app/controller/homeController');
const itemController = require('../app/controller/ItemController');

router.get('/', homeController.menu);
router.get('/:slug', itemController.itemDetail);
module.exports = router;