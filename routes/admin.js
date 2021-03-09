const express = require("express");
const router = express.Router();
const isAdmin =require("../middleware/admin");
const {dashboard, addHRPage, addNewHr,addCustomAttributePage,addNewCustomAttribute,addIndependentPage,addNewIndependent,viewCustomAttributePage,editCustomAttributePage,editCustomAttribute,deleteCustomAttribute,viewIndependentPage,editIndependentPage,editIndependent,deleteIndependent,viewHRPage,editHRPage,editHR,deleteHR}=require("../controllers/adminController");


router.get("/",dashboard);
router.get("/dashboard",dashboard);
router.get("/addHR",addHRPage);
router.post("/addHR", addNewHr);
router.get("/viewHR",viewHRPage);
router.get("/editHR/:id",editHRPage);
router.post("/editHR/:id",editHR);
router.post("/deleteHR/:id",deleteHR);
router.get("/addCustomAttribute",addCustomAttributePage);
router.post("/addCustomAttribute",addNewCustomAttribute);
router.get("/addNew/:id",addIndependentPage);
router.post("/addNew/:id",addNewIndependent);
router.get("/viewCustomAttribute",viewCustomAttributePage);
router.get("/viewCustomAttribute/edit/:id",editCustomAttributePage );
router.post("/viewCustomAttribute/edit/:id",editCustomAttribute);
router.post("/viewCustomAttribute/delete/:id",deleteCustomAttribute);
router.get("/:id",viewIndependentPage);
router.get("/:id/edit/:id",editIndependentPage);
router.post("/:id/edit/:id",editIndependent);
router.post("/:id/delete/:id",deleteIndependent);



module.exports = router;