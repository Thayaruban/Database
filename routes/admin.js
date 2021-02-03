const express = require("express");
const router = express.Router();
const pool= require("../config/database");


router.get("/dashboard",(req,res)=>{
        res.render("admin/adminDashboard",{
            active1:" ",
            activeHR:" ",activeAdmin:"active",
            title:"Admin Dashboard"
            
        });
});

router.get("/addHR",async (req,res)=>{

    pool.query("select * from customAttributes", (error, result)=>{
        if(error) console.log('Error in mysql', error);
        else {
            if( result.length > 0 ){
               
               // res.json(result);
               res.render("admin/addHR",{
                active1:" ",
                activeAdmin:" ",
                activeHR:"active",
                title:"Add HR",
                attributes:result
                
            });
            }
        }
    })
    
});





module.exports = router;