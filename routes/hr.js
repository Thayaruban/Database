const express = require("express");
const router = express.Router();
const {hrDashboard,error} = require("../controllers/indexcontroller");
const {addEmployeePage,addNewEmployee,viewEmployeePage, editEmployee, deleteEmployee, editEmployeePage,viewProfilePage,editProfilePage,hrApproveLeave,hrApproveLeavesPage,applyLeave,applyLeavePage,editProfile} = require("../controllers/hrController");

//GET
router.get("/hrDashboard",hrDashboard);
//router.get("/hrProfile",hrProfile);
router.get("/hrAddEmployees",addEmployeePage);
router.post("/addEmployee",addNewEmployee);
router.get("/hrManageEmployees",viewEmployeePage);
router.get("/editEmployee/:id",editEmployeePage);
router.post("/editEmployee/:id",editEmployee);
router.post("//deleteEmployee/:id",deleteEmployee);
router.get("/viewProfile/:id",viewProfilePage);
router.get("/editProfile/:id",editProfilePage);
router.post("/editProfile/:id",editProfile);
router.get("/hrApproveLeave/:id",hrApproveLeavesPage);
router.get("/hrApproveLeave/approve/:id",hrApproveLeave);
router.get("/hrApproveLeave/denied/:id",hrApproveLeave);
router.get("/applyLeave",applyLeavePage);
router.post("/applyLeave/:id",applyLeave);

//router.get("/*",error);

//POST

module.exports = router;
