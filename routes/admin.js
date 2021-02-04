const express = require("express");
const router = express.Router();
const pool= require("../config/database");

router.get("/",(req,res)=>{
    res.render("admin/adminDashboard",{
        active1:" ",
        activeHR:" ",activeAdmin:"active",
        activeCustomAttribute:" ",
        title:"Admin Dashboard"
        
    });
});


router.get("/dashboard",(req,res)=>{
        res.render("admin/adminDashboard",{
            active1:" ",
            activeHR:" ",activeAdmin:"active",
            activeCustomAttribute:" ",
            title:"Admin Dashboard"
            
        });
});

router.get("/addHR",async (req,res)=>{

    await pool.query("select * from customAttributes", (error, result)=>{
        if(error) console.log('Error in mysql', error);
        else {
            if( result.length > 0 ){
               
               // res.json(result);
               res.render("admin/addHR",{
                active1:" ",
                activeAdmin:" ",
                activeHR:"active",
                activeCustomAttribute:" ",
                title:"Add HR",
                attributes:result
                
            });
            }
        }
    })
    
});
router.get("/addCustomAttribute", (req,res)=>{

    
    res.render("admin/addCustomAttribute",{
     active1:" ",
     activeAdmin:" ",
     activeCustomAttribute:"active",
     activeHR:" ",
     title:"Add Custom Attribute",
     


})
router.post("/addCustomAttribute",(req,res)=>{
    
    //console.log(req.body.attributeName);

    pool.query('insert into `customAttributes`  SET ?', {attributeName: req.body.attributeName,defaultValue:req.body.defaultValue}, (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            res.redirect('/admin/addCustomAttribute');
        }
    })
    
   

});



    
});

router.get("/viewCustomAttribute", (req,res)=>{

    
     pool.query("select * from customAttributes", (error, result)=>{
        if(error) console.log('Error in mysql', error);
        else {
            if( result.length > 0 ){
               
               // res.json(result);
               res.render("admin/viewCustomAttribute",{
                active1:" ",
                activeAdmin:" ",
                activeHR:"",
                activeCustomAttribute:"active",
                title:"View Custom Attribute",
                attributes:result
                
            });
            }
        }
    })

});

router.get("/viewCustomAttribute/edit/:id", (req,res)=>{

    
     pool.query("select * from customAttributes where idcustomAttributes=?;",[req.params.id], (error, result)=>{
        if(error) console.log('Error in mysql', error);
        else {
            if( result.length > 0 ){
                
               
              
               res.render("admin/editCustomAttribute",{
                active1:" ",
                activeAdmin:" ",
                activeHR:"",
                activeCustomAttribute:"active",
                title:`Edit Custom Attribute`,
                attribute:result[0]
                
            });
            }
        }
    })

});



router.post("/viewCustomAttribute/edit/:id", (req,res)=>{
    console.log("sss");
    
   
    pool.query('UPDATE ?? SET ?? = ?,?? = ? WHERE idcustomAttributes= ?', ["customAttributes", "attributeName", req.body.attributeName, "defaultValue",req.body.defaultValue,req.params.id], (error)=>{
      if(error) console.log('Error in mysql', error);
      else {
       res.redirect("/admin/viewCustomAttribute");
         
          
          
    
}

})

});

router.post("/viewCustomAttribute/delete/:id", (req,res)=>{
    
    
    pool.query("delete from customAttributes where idcustomAttributes=?",[req.params.id], (error)=>{
       if(error) console.log('Error in mysql', error);
       else {
              // res.json(result);
              res.redirect("/admin/viewCustomAttribute");
           
       }
   })

});













module.exports = router;