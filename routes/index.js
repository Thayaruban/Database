const express = require("express");
const pool = require("../config/database");
const router = express.Router();
const {indexpage} = require("../controllers/indexcontroller");
const bcrypt=require("bcrypt");
const { request } = require("express");





//GET 
router.get("/",indexpage);

router.post("/login",async(req,res)=>{
 
   let {username,password}=req.body;
   if(username=="admin"){
    await pool.query(`SELECT password from admin`,async(err,result)=>{
       
        const isPasswordCorrect = await bcrypt.compare(password, result[0].password);
        
        if(isPasswordCorrect){
            req.session.role="admin";
           
            console.log(req.session);
            
            res.redirect("/admin/dashboard")
        }else{
            console.log(req.session);
            res.redirect("/");
        }
    
       });
   }else{

    await pool.query(`SELECT * from HRFull where employee_id=?`,[username],async(err,result)=>{
        console.log(result);
        const isPasswordCorrect = await bcrypt.compare(password, result[0].password);
        console.log(isPasswordCorrect,result[0].password);
        if(isPasswordCorrect){
            req.session.role=result[0].role_title;
            req.session.paygrade=result[0].paygrade_id;
            console.log(req.session.role);
            if(req.session.role=="hr manager"){
               
                res.redirect("/hr/hrDashboard");
            }else if(req.session.role=="supervisor"){

            }else if(req.session.role=="employee"){

            }
            
            
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