const pool= require("../config/database");
const bcrypt=require("bcrypt");
const nodemailer = require('nodemailer');
const transporter = require("../helper.js");

var ID = function () {
    
    return 'Emp' + Math.random().toString(36).substr(2, 9);
  };

  function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}


module.exports={
    dashboard: (req,res)=>{
    res.render("admin/adminDashboard",{
        active1:" ",
        activeHR:" ",activeAdmin:"active",
        activeCustomAttribute:" ",
        title:"Admin Dashboard",activeStatus:" "
        
    });
},

 addHRPage:(req,res)=>{// get add new HR form

    pool.query("select * from custom_field; select * from paygrade;select * from job;select * from employment_status;select * from branch;select * from department;select distinct(employment_status)from employment_status;select * from role;" , (error, result)=>{
       if(error) console.log('Error in mysql', error);
       else {
           if( result.length > 0 ){
               
              
              
              res.render("admin/addHR",{
               active1:" ",
               activeAdmin:" ",
               activeHR:"active",
               activeCustomAttribute:" ",
               title:"Add HR",
               attributes:result[0],activeStatus:" ",jobs:result[2],payGrades:result[1],employmentStatuses:result[3],branches:result[4],department:result[5],employmentStatusesU:result[6],role:result[7]
               
           });
           }
       }
   })
   
},

addNewHr:(req,res)=>{//  add new HR to employee record and create a user
    
    const id=ID();
    console.log(req.body);
   
    let {first_name,last_name,email,dob,mobile,landline,address,gender,marital_status,residency,emergency_first_name,emergency_last_name,emergency_address,emergency_mobile,emergency_landline,relationship,branch,department,employment_status,employment_status_category,paygrade,accno,custom,job,role}=req.body;
    const randomtext =getRandomString(8);
    
   
    
    
    pool.query(`select employment_status_id from employment_status where employment_status=? and category=?`,[employment_status,employment_status_category],async(error,result)=>{
        if(error) console.log(error);
        else{
        
        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(randomtext, salt,async (err, hash) => {
              if (err) {
                console.log(err);
              }
              else {
                
                await pool.query("call add_employee(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",[id,first_name,email,gender,last_name,dob,marital_status,address,residency,mobile,landline,hash,emergency_first_name,emergency_last_name,emergency_mobile,emergency_landline,relationship,emergency_address,parseInt(paygrade),accno,parseInt(result[0].employment_status_id),parseInt(branch),new Date(),job,department,role] ,async(error,result)=>{
                   
                    if(error)console.log('Error in mysql', error);
                
                    else{
                        const keys = Object.keys(custom);
                        for (let i = 0; i < keys.length; i++) {
                                const key = keys[i];
                                console.log(key, custom[key]);
                                await pool.query(`select field_id from custom_field where field_name=?`,[key],(err,result)=>{
                                    if(err)console.log(err);
                                    else{
                                        console.log(result,key,custom[key]);
                                        pool.query("insert into custom_information(employee_id,field_id,value)values(?,?,?)",[id,result[0].field_id,custom[key]])
                                    }
                                })
                        }
                        
                        
                        const mailOptions = {
                            from: 'littlelady2606@gmail.com',
                            to: email,
                            subject: 'Username and Password',
                            text: `Hello ${first_name,last_name}!!\nYour username is ${id}.\nYour password is ${randomtext}`
                          };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message sent: %s', info.messageId);   
                            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                      
                            ;
                        });
                        
                       
                        res.redirect("/admin/addHR");}
                
          
      
    });
              }
            });
          });
        }
              
    
    })

    
},

viewHRPage:(req,res)=>{// view all HR Managers
      pool.query("select * from EmployeeFull where role_id=1 ",(error,result)=>{
          if(error)console.log(error);
          else{
            
              res.render("admin/viewHR",{
                 
                  views:result,
                  title:"View HR",
                  activeAdmin:"",
                  activeCustomAttribute:" ",
                  activeHR:true,
                  activeStatus:""
              })
          }
      })

    },

editHRPage:(req,res)=>{
    pool.query("select * from EmployeeFull where employee_id=?;select * from custom_field; select * from paygrade;select * from job;select * from employment_status;select * from branch;select * from department;select distinct(employment_status)from employment_status;select * from role",[req.params.id],(error,result)=>{
        if(error)console.log(err);
        else{
            console.log(result[0]);
           
            res.render("admin/editHR",{
               
                views:result,
                title:"View HR",
                activeAdmin:"",
                activeCustomAttribute:" ",
                activeHR:true,
                activeStatus:"",
                HR:result[0][0], attributes:result[1],jobs:result[3],payGrades:result[2],employmentStatuses:result[4],branches:result[5],department:result[6],employmentStatusesU:result[7],role:result[8]
            })
        }
    })

},
editHR:(req,res)=>{
    const id=req.params.id;
    let {first_name,last_name,email,dob,mobile,landline,address,gender,marital_status,residency,emergency_first_name,emergency_last_name,emergency_address,emergency_mobile,emergency_landline,relationship,branch,department,employment_status,employment_status_category,paygrade,accno,custom}=req.body;
    pool.query(`select employment_status_id from employment_status where employment_status=? and category=?;`,[employment_status,employment_status_category],async(error,result)=>{
        if(error) console.log(error);
        else{
                await pool.query("call edit_employee(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",[id,first_name,email,gender,last_name,dob,marital_status,address,residency,mobile,landline,emergency_first_name,emergency_last_name,emergency_mobile,emergency_landline,relationship,emergency_address,parseInt(paygrade),accno,parseInt(result[0].employment_status_id),parseInt(branch),new Date(),job,department,role] ,(error,result)=>{
                   
                    if(error)console.log('Error in mysql', error);
                
                    else{
                       
                       
                        res.redirect("/admin/viewHR");}
                
          
      
    });
             
           
         
        }
              
    
    })


},
deleteHR:(req,res)=>{
    pool.query(`call delete_employee(?)`,[req.params.id],(err,result)=>{
        if(err)console.log(err);
        else{
            res.redirect(admin/viewHR);
        }
    })

},
addCustomAttributePage:(req,res)=>{// get new addCustomAttribute form

    
    res.render("admin/addCustomAttribute",{
     active1:" ",
     activeAdmin:" ",
     activeCustomAttribute:"active",
     activeHR:" ",
     title:"Add Custom Attribute",activeStatus:" "
     


})
},
addNewCustomAttribute:(req,res)=>{//add new CustomAttribute
    
    
    console.log(req.body);
    pool.query('insert into `custom_field`  SET ?', {field_name: req.body.attributeName,default_value:req.body.default_value }, (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            
            res.redirect('/admin/viewCustomAttribute');
        }
    })
    
   

},
addIndependentPage:(req,res)=>{//get add new independent feature form
    const id=req.params.id;
    
    pool.query(`select * from employee_job natural join employee where paygrade_id>? and role_id=?`, [3,2], (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            console.log(result[0]);
            res.render("admin/addNewIndependent",{
                active1:" ",
                activeAdmin:" ",
                activeCustomAttribute:"",
                activeHR:" ",
                id,
                title: "Add new "+id,activeStatus:"active ",supervisor:result
                
           
           
           })
        }
    })
    
},
addNewIndependent:(req,res)=>{ //add new independent feature.Independent features are Employment status,JobTitle,PayGrade
    const id=req.params.id;
    const tableName=id.charAt(0).toLowerCase()+id.slice(1);
 if ( id=="paygrade"){ 
    pool.query(`insert into ${tableName}  SET ${id}_title =?,basic_salary=?`, [req.body.title,req.body.salary], (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            res.redirect(`/admin/${tableName}`);
        }
    })

 }else if(id=="employment_status"){
    console.log(req.body);
    pool.query(`insert into ${tableName}  SET  ?`, {"employment_status":req.body.title,"category":req.body.category}, (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            res.redirect(`/admin/${tableName}`);
        }
    })


 }else if(id=="job"){
     console.log(req.body);
    pool.query(`insert into job  SET  ?`, {"job_title":req.body.title}, (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            res.redirect(`/admin/${tableName}`);
        }
    })
}else if(id=="department"){
    console.log(req.body);
    pool.query(`insert into ${tableName}  SET  ?`, {"department_title":req.body.title,"building":req.body.building,"department_description":req.body.description,"supervisor_id":req.body.supervisor}, (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            res.redirect(`/admin/${tableName}`);
        }
    })

 }else if(id=="branch"){
    console.log(req.body);
    pool.query(`insert into ${tableName}  SET  ?`, {"branch_title":req.body.title,"address":req.body.address}, (error, result) => {
        if(error) console.log('Error in mysql', error);
        else {
            res.redirect(`/admin/${tableName}`);
        }
    })
 }
},
viewCustomAttributePage:(req,res)=>{// view all CustomAttributes

    
    pool.query("select * from custom_field", (error, result)=>{
       if(error) console.log('Error in mysql', error);
       else {
           if( result ){
              
             
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

},
editCustomAttributePage:(req,res)=>{//get edit a customAttribute form
    

    
    pool.query("select * from custom_field where field_id=?;",[req.params.id], (error, result)=>{
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

},
editCustomAttribute:(req,res)=>{//edit an existing custom attribute
    
   
    
    pool.query(`select field_name from custom_field where field_id=?;UPDATE ?? SET ?? = ?,?? = ?,??= ? where  field_id= ?`, [req.params.id,"custom_field", "field_name", req.body.attribute_name, "default_value",req.body.default_value,req.params.id],async (error,result)=>{
      if(error) console.log('Error in mysql', error);
      else {
       
       
     
       res.redirect("/admin/viewCustomAttribute");
         
          
          
    
}

})

},
deleteCustomAttribute:(req,res)=>{//delete a custom attribute
    
    
    pool.query(" select field_name from custom_field where field_id=?; delete from custom_field where field_id=?;",[req.params.id,req.params.id], async(error,result)=>{
       if(error) console.log('Error in mysql', error);
       else {  
             
             
              res.redirect("/admin/viewCustomAttribute");
           
       }
   })

},

viewIndependentPage:async(req,res)=>{//get independent features list.
    const id =req.params.id;
    
    
   
   
   
    if (id=="employment_status"||id == "job"||id== "paygrade"||id =="branch"){
        

        await pool.query(`select * from ${id} `, (error, result)=>{
            if(error) console.log('Error in mysql', error);
            else {
                if( result){
                    console.log(result);
                    

                   res.render("admin/independent",{
                    active1:" ",
                    activeAdmin:" ",
                    activeHR:"",
                    activeCustomAttribute:" ",
                    activeStatus:"active",
                    title:"Add new Independent",
                    id,
                    datas:result
                    
                });
                }
            }
        })
     
            
    }else if (id=="department"){
       
        
        
 
         await pool.query(`select * from department natural join employee where(employee.employee_id=department.supervisor_id) `, (error, result)=>{
             if(error) console.log('Error in mysql', error);
             else {
                 if( result){
                     console.log(result);
                     
 
                    res.render("admin/independent",{
                     active1:" ",
                     activeAdmin:" ",
                     activeHR:"",
                     activeCustomAttribute:" ",
                     activeStatus:"active",
                     title:"Add new Independent",
                     id,
                     datas:result
                     
                 });
                 }
             }
         })
      
             
     }
    

    
},

editIndependentPage:(req,res)=>{//get add new independent feature form
    const id=req.params.id;
    const tableName=req.path.split("/")[1]; 
    

    pool.query(`select * from employee_job_information natural join employee where employee_id=(select supervisor_id from department where  department_id=?);select * from ${tableName} where ${tableName}_id=?;select * from employee_job_information natural join employee where paygrade_id>?`,[id,id,3],(error,result)=>{
        if(error) console.log('Error in mysql', error);
        else {
            if( result){
               
                
                
              
               res.render("admin/editIndependent",{
            active1:" ",
            activeAdmin:" ",
            activeCustomAttribute:"",
            activeHR:" ",
            id,
            tableName,
            title: "Edit "+tableName,activeStatus:"active ",
            independent:result[1][0],
            supervisor:result[2],
            supervisorName:result[0][0]
            
       
       
       })
       
            }

        }


    
})
},

editIndependent:(req,res)=>{// edit independent feature form
    const secondWord=req.path.split("/")[1]; 
    const id=req.params.id;
    
   
   
   
    if (secondWord=="branch"){
        
       
        pool.query(`UPDATE ?? SET ?? = ?,??=? WHERE branch_id= ?`, [secondWord, "branch_title", req.body.title,"address",req.body.address, id], (error)=>{
            if(error) console.log('Error in mysql', error);
            else {
             res.redirect(`/admin/${secondWord}`);
               
                
                
          
      }
      
      })
    }else if (secondWord=="department"){
        
       
        pool.query(`UPDATE department SET ?? = ?,??=?,??=?,??=? WHERE department_id= ?`, ["department_title", req.body.title,"building",req.body.building,"department_description",req.body.description,"supervisor_id",req.body.supervisor ,id], (error)=>{
            if(error) console.log('Error in mysql', error);
            else {
             res.redirect(`/admin/${secondWord}`);
               
                
                
          
      }
      
      })
    }else if (secondWord=="paygrade"){
       
        
       
        pool.query(`UPDATE paygrade SET ?? = ?,??=? WHERE paygrade_id= ?`, ["paygrade_title", req.body.title,"basic_salary",req.body.salary ,id], (error)=>{
            if(error) console.log('Error in mysql', error);
            else {
             res.redirect(`/admin/${secondWord}`);
               
                
                
          
      }
      
      })
    }else if (secondWord=="job"){
       
        
       
        pool.query(`UPDATE job SET ?? = ? WHERE job_id= ?`, ["job_title", req.body.title,id], (error)=>{
            if(error) console.log('Error in mysql', error);
            else {
             res.redirect(`/admin/${secondWord}`);
               
                
                
          
      }
      
      })
    }else if (secondWord=="employment_status"){
        console.log(req.body)
        
       
        pool.query(`UPDATE employment_status SET ?? = ?,??=? WHERE employment_status_id= ?`, ["employment_status", req.body.title,"category",req.body.category,id], (error)=>{
            if(error) console.log('Error in mysql', error);
            else {
             res.redirect(`/admin/${secondWord}`);
               
                
                
          
      }
      
      })
    }
       
    
},

deleteIndependent:(req,res)=>{// delete independent feature 
    const secondWord=req.path.split("/")[1]; 
    const id=req.params.id;
    
    
   
    if (secondWord=="employmentStatus"||"jobTitle"||"payGrade"||"branch"||"department"){
        
       
        pool.query(`delete from  ??  WHERE ${secondWord}_id= ?`, [secondWord, id], (error)=>{
            if(error) console.log('Error in mysql', error);
            else {
             res.redirect(`/admin/${secondWord}`);
               
                
                
          
      }
      
      })
    }
       
    
}




}


