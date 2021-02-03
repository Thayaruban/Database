const express = require("express");
const router = express.Router();
const {indexpage} = require("../controllers/indexcontroller");

//GET 
router.get("/",indexpage);


//USE
router.use('/hr', require('./hr'));
router.use('/admin', require('./admin'));

module.exports = router;