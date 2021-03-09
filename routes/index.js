const express = require("express");
const pool = require("../config/database");
const router = express.Router();
const {indexpage} = require("../controllers/indexcontroller");
const bcrypt=require("bcrypt");
const { request } = require("express");




router.use(function(req, res, next) {
    res.locals.full_name = req.session.full_name;
    res.locals.job_title=req.session.job_title;
    res.locals.paygrade=req.session.paygrade;
    res.locals.role=req.session.role;
    res.locals.eid=req.session.eid;
    next();
  });
//GET 
router.get("/",indexpage);

router.post("/login",async(req,res)=>{
 
   let {username,password}=req.body;
   if(username=="admin"){
    await pool.query(`SELECT password from admin`,async(err,result)=>{
       
        const isPasswordCorrect = await bcrypt.compare(password, result[0].password);
        
        if(isPasswordCorrect){
            req.session.role="admin";
           
           
            
            res.redirect("/admin/dashboard")
        }else{
           
            res.redirect("/");
        }
    
       });
   }else{

    await pool.query(`SELECT * from EmployeeFull where employee_id=?`,[username],async(err,result)=>{
       
        const isPasswordCorrect = await bcrypt.compare(password, result[0].password);
        
        if(isPasswordCorrect){
           
            req.session.role=result[0].role_title;
            req.session.paygrade=result[0].paygrade_id;
            req.session.job_title=result[0].job_title;
            req.session.full_name=result[0].first_name;
            req.session.eid=result[0].employee_id;
           req.session.department=result[0].department_id;
            console.log(req.session);
            res.redirect("/hr/hrDashboard");
            
            
            
        }else{
            
            res.redirect("/");
        }
    
       });

   }
});

router.post("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/");
})








//USE
router.use('/hr', require('./hr'));
router.use('/admin', require('./admin'));

module.exports = router;