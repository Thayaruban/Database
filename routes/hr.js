const express = require("express");
const router = express.Router();
const {hrDashboard,error} = require("../controllers/indexcontroller");
const {hrProfile,hrAddEmployeesPage,hrManageEmployeesPage} = require("../controllers/hrController");

//GET
router.get("/hrDashboard",hrDashboard);
router.get("/hrProfile",hrProfile);
router.get("/hrAddEmployees",hrAddEmployeesPage);
router.get("/hrManageEmployees",hrManageEmployeesPage);
router.get("/*",error);

//POST

module.exports = router;
