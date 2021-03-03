const express = require("express");
const router = express.Router();
const isAdmin =require("../middleware/admin");
const {dashboard, addHRPage, addNewHr,addCustomAttributePage,addNewCustomAttribute,addIndependentPage,addNewIndependent,viewCustomAttributePage,editCustomAttributePage,editCustomAttribute,deleteCustomAttribute,viewIndependentPage,editIndependentPage,editIndependent,deleteIndependent,viewHRPage,editHRPage,editHR,deleteHR}=require("../controllers/adminController");


router.get("/",isAdmin,dashboard);
router.get("/dashboard",isAdmin,dashboard);
router.get("/addHR",isAdmin,addHRPage);
router.post("/addHR",isAdmin, addNewHr);
router.get("/viewHR",isAdmin,viewHRPage);
router.get("/editHR/:id",isAdmin,editHRPage);
router.post("/editHR/:id",isAdmin,editHR);
router.post("/deleteHR/:id",isAdmin,deleteHR);
router.get("/addCustomAttribute",isAdmin,addCustomAttributePage);
router.post("/addCustomAttribute",isAdmin,addNewCustomAttribute);
router.get("/addNew/:id",isAdmin,addIndependentPage);
router.post("/addNew/:id",isAdmin,addNewIndependent);
router.get("/viewCustomAttribute",isAdmin,viewCustomAttributePage);
router.get("/viewCustomAttribute/edit/:id",isAdmin,editCustomAttributePage );
router.post("/viewCustomAttribute/edit/:id",isAdmin,editCustomAttribute);
router.post("/viewCustomAttribute/delete/:id",isAdmin,deleteCustomAttribute);
router.get("/:id",isAdmin,viewIndependentPage);
router.get("/:id/edit/:id",isAdmin,editIndependentPage);
router.post("/:id/edit/:id",isAdmin,editIndependent);
router.post("/:id/delete/:id",isAdmin,deleteIndependent);
router.get('/:filter_type?/:table?/:attr?/:id?/:custom_field_id?', (req, res)=>{

    switch(req.params.filter_type){
        case 'default':
            var query = 'select * FROM employees_details where ?;';
            var para = {[req.params.table]:req.params.id};
            var page_para = {filter_type:'default', table:req.params.table,value:req.params.id, heading: `Showing results for ${req.params.attr}` };
            break;
        case 'custom':
            var query = 'select * FROM employees_details where ?;';
            var para = {['custom_field_'+req.params.custom_field_id+'_id']:req.params.id};
            var page_para = {filter_type:'custom', custom_field_id:req.params.custom_field_id,custom_field_value_id:req.params.id, heading: `Showing results for ${req.params.attr}`};
            break;
        default:
            var query = 'select * FROM employees_details;';
            var para = {};
            var page_para = {filter_type:'none', heading: 'Showing All results'};
    }
    db.query(query+"select * from custom_fields;select * from custom_field_values;select dept_id id, name title from departments;select pay_grade_level id, pay_grade_level_title title from pay_grades;select job_id id, job_title_name title from job_titles;", para, (error, result)=>{
        if(error) console.log('mysql error', error);
        else {
            console.log(para);
            if( true ){
                result[0].forEach( row => {
                    row.birthdate = row.birthdate !== null ? dateFormat( row.birthdate, 'dddd, mmmm dS, yyyy' ) : ''
                })
                res.render('employees/', {employees: result[0], custom_fields: result[1], custom_field_values: result[2] ,rest_fields: result.slice(3), page_para});
            }
        }
    })
});




module.exports = router;