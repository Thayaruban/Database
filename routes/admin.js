const express = require("express");
const router = express.Router();
const pool= require("../config/database");

router.get("/",(req,res)=>{
    res.render("admin/adminDashboard",{
        active1:" ",
        activeHR:" ",activeAdmin:"active",
        activeCustomAttribute:" ",
        title:"Admin Dashboard",activeStatus:" "
        
    });
});


router.get("/dashboard",(req,res)=>{
        res.render("admin/adminDashboard",{
            active1:" ",
            activeHR:" ",activeAdmin:"active",
            activeCustomAttribute:" ",
            title:"Admin Dashboard",activeStatus:" "
            
        });
});

router.get("/addHR",async (req,res)=>{// get add new HR form

    await pool.query("select * from customAttributes", (error, result)=>{
        if(error) console.log('Error in mysql', error);
        else {
            if( result.length > 0 ){
               
               
               res.render("admin/addHR",{
                active1:" ",
                activeAdmin:" ",
                activeHR:"active",
                activeCustomAttribute:" ",
                title:"Add HR",
                attributes:result,activeStatus:" "
                
            });
            }
        }
    })
    
});
router.get("/addCustomAttribute", (req,res)=>{// get new addCustomAttribute form

    
    res.render("admin/addCustomAttribute",{
     active1:" ",
     activeAdmin:" ",
     activeCustomAttribute:"active",
     activeHR:" ",
     title:"Add Custom Attribute",activeStatus:" "
     


})



    
});

router.get("/addNew/:id", (req,res)=>{//get add new independent feature form
    const id=req.params.id;
    const tableName=id.charAt(0).toLowerCase()+id.slice(1);

    
    res.render("admin/addNewIndependent",{
     active1:" ",
     activeAdmin:" ",
     activeCustomAttribute:"",
     activeHR:" ",
     id,
     title: "Add new "+id,activeStatus:"active "
     


})



    
});


router.post("/addNew/:id", (req,res)=>{ //add new independent feature.Independent features are Employment status,JobTitle,PayGrade
    const id=req.params.id;
    const tableName=id.charAt(0).toLowerCase()+id.slice(1);

    
    pool.query(`insert into ${tableName}  SET ?`, {"title":req.body.title}, (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            res.redirect(`/admin/${tableName}`);
        }
    })



    
});



router.post("/addCustomAttribute",(req,res)=>{//add new CustomAttribute
    
    

    pool.query('insert into `customAttributes`  SET ?', {attributeName: req.body.attributeName,defaultValue:req.body.defaultValue}, (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            res.redirect('/admin/addCustomAttribute');
        }
    })
    
   

});


router.get("/viewCustomAttribute", (req,res)=>{// view all CustomAttributes

    
     pool.query("select * from customAttributes", (error, result)=>{
        if(error) console.log('Error in mysql', error);
        else {
            if( result.length > 0 ){
               
              
               res.render("admin/viewCustomAttribute",{
                active1:" ",
                activeAdmin:" ",
                activeHR:"",
                activeCustomAttribute:"active",
                title:"View Custom Attribute",
                attributes:result,activeStatus:" "
                
            });
            }
        }
    })

});

router.get("/viewCustomAttribute/edit/:id", (req,res)=>{//get edit a customAttribute form
    

    
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
                attribute:result[0],activeStatus:" "
                
            });
            }
        }
    })

});



router.post("/viewCustomAttribute/edit/:id", (req,res)=>{//edit an existing custom attribute
    
   
    pool.query('UPDATE ?? SET ?? = ?,?? = ? WHERE idcustomAttributes= ?', ["customAttributes", "attributeName", req.body.attributeName, "defaultValue",req.body.defaultValue,req.params.id], (error)=>{
      if(error) console.log('Error in mysql', error);
      else {
       res.redirect("/admin/viewCustomAttribute");
         
          
          
    
}

})

});

router.post("/viewCustomAttribute/delete/:id", (req,res)=>{//delete a custom attribute
    
    
    pool.query("delete from customAttributes where idcustomAttributes=?",[req.params.id], (error)=>{
       if(error) console.log('Error in mysql', error);
       else {
              
              res.redirect("/admin/viewCustomAttribute");
           
       }
   })

});



router.get("/:id", async(req,res)=>{//get independent features list.
    const id =req.params.id;
    
    const title= id.charAt(0).toUpperCase()+id.slice(1);
   
   
    if (id=="employmentStatus"||"jobTitle"||"payGrade"){
        
       

        await pool.query(`select * from ${id}`, (error, result)=>{
            if(error) console.log('Error in mysql', error);
            else {
                if( result.length > 0 ){

                   res.render("admin/independent",{
                    active1:" ",
                    activeAdmin:" ",
                    activeHR:"",
                    activeCustomAttribute:" ",
                    activeStatus:"active",
                    title,
                    id,
                    datas:result
                    
                });
                }
            }
        })
     
            
    }
    

    
});

router.get("/:id/edit/:id", (req,res)=>{//get add new independent feature form
    const id=req.params.id;
    const tableName=req.path.split("/")[1]; 
    

    pool.query(`select * from ${tableName} where id=? `,[id],(error,result)=>{
        if(error) console.log('Error in mysql', error);
        else {
            if( result.length > 0 ){
               res.render("admin/editIndependent",{
            active1:" ",
            activeAdmin:" ",
            activeCustomAttribute:"",
            activeHR:" ",
            id,
            tableName,
            title: "Edit"+tableName,activeStatus:"active ",
            independent:result[0]
            
       
       
       })
       
            }

        }


    
})
});

router.post("/:id/edit/:id", (req,res)=>{// edit independent feature form
    const secondWord=req.path.split("/")[1]; 
    const id=req.params.id;
    
    const title= secondWord.charAt(0).toUpperCase()+id.slice(1);
   
   
    if (secondWord=="employmentStatus"||"jobTitle"||"payGrade"){
        
       
        pool.query('UPDATE ?? SET ?? = ? WHERE id= ?', [secondWord, "title", req.body.title, id], (error)=>{
            if(error) console.log('Error in mysql', error);
            else {
             res.redirect(`/admin/${secondWord}`);
               
                
                
          
      }
      
      })
    }
       
    
});


router.post("/:id/delete/:id", (req,res)=>{// delete independent feature 
    const secondWord=req.path.split("/")[1]; 
    const id=req.params.id;
    
    
   
    if (secondWord=="employmentStatus"||"jobTitle"||"payGrade"){
        
       
        pool.query('delete from  ??  WHERE id= ?', [secondWord, id], (error)=>{
            if(error) console.log('Error in mysql', error);
            else {
             res.redirect(`/admin/${secondWord}`);
               
                
                
          
      }
      
      })
    }
       
    
});



















module.exports = router;