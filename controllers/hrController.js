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

module.exports ={
   
    addEmployeePage:(req,res)=>{// get add new Employee form
        console.log(req.session);
        pool.query("select * from custom_field; select * from paygrade;select * from job;select * from employment_status;select * from branch;select * from department;select distinct(employment_status)from employment_status;select * from role;" , (error, result)=>{
           if(error) console.log('Error in mysql', error);
           else {
               if( result.length > 0 ){
                   
                  
                  
                  res.render("hrAddemployees",{
                   active1:" ",
                   activeAdmin:" ",
                   activeHR:"active",
                   activeProfile:" ",
                   activeCustomAttribute:" ",
                   activeEmployees:true,
                   title:"Add Employee",
                   attributes:result[0],activeStatus:" ",jobs:result[2],payGrades:result[1],employmentStatuses:result[3],branches:result[4],department:result[5],employmentStatusesU:result[6],role:result[7]
                   
               });
               }
           }
       })
       
    },
    
    addNewEmployee:(req,res)=>{//  add new Employee to employee record and create a user
        
        const id=ID();
        
       
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
                                    
                                    await pool.query(`select field_id from custom_field where field_name=?`,[key],(err,result)=>{
                                        if(err)console.log(err);
                                        else{
                                           
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
                            
                           
                            res.redirect("/hr/hrAddEmployees");}
                    
              
          
        });
                  }
                });
              });
            }
                  
        
        })
    
        
    },viewEmployeePage:(req,res)=>{// view all Employees except HR Managers
        pool.query("select * from EmployeeFull where role_id<>1",(error,result)=>{
            if(error)console.log(error);
            else{
              
                res.render("hrManageEmployees",{
                   
                    views:result,
                    title:"View Employee",
                    activeAdmin:"",
                    active1:"",
                    activeCustomAttribute:" ",
                    activeHR:" ",
                    activeProfile:" ",
                    activeEmployees:true,
                    activeStatus:""
                })
            }
        })
  
      },
  
  editEmployeePage:(req,res)=>{
      pool.query("select * from EmployeeFull where employee_id=?;select * from custom_field; select * from paygrade;select * from job;select * from employment_status;select * from branch;select * from department;select distinct(employment_status)from employment_status;select * from role;",[req.params.id],(error,result)=>{
          if(error)console.log(error);
          else{
              console.log(result[0]);
             
              res.render("hrEditEmployee",{
                 
                  views:result,
                  title:"Edit Employee",
                  activeAdmin:"",
                  activeCustomAttribute:" ",
                  activeHR:true,
                  active1:" ",
                  activeProfile:"",
                  activeEmployees:true,
                  activeStatus:"",
                  HR:result[0][0], attributes:result[1],jobs:result[3],payGrades:result[2],employmentStatuses:result[4],branches:result[5],department:result[6],employmentStatusesU:result[7],role:result[8]
              })
          }
      })
  
  },
  editEmployee:(req,res)=>{
      const id=req.params.id;
      let {first_name,last_name,email,dob,mobile,landline,address,gender,marital_status,residency,emergency_first_name,emergency_last_name,emergency_address,emergency_mobile,emergency_landline,relationship,branch,department,employment_status,employment_status_category,paygrade,accno,custom,job,role}=req.body;
      pool.query(`select employment_status_id from employment_status where employment_status=? and category=?;`,[employment_status,employment_status_category],async(error,result)=>{
          if(error) console.log(error);
          else{
                  await pool.query("call edit_employee(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",[id,first_name,email,gender,last_name,dob,marital_status,address,residency,mobile,landline,emergency_first_name,emergency_last_name,emergency_mobile,emergency_landline,relationship,emergency_address,parseInt(paygrade),accno,parseInt(result[0].employment_status_id),parseInt(branch),new Date(),job,department,role] ,(error,result)=>{
                     
                      if(error)console.log('Error in mysql', error);
                  
                      else{
                         
                         
                          res.redirect("/hr/hrManageEmployees");}
                  
            
        
      });
               
             
           
          }
                
      
      })
  
  
  },
  deleteEmployee:(req,res)=>{
      pool.query(`call delete_employee(?)`,[req.params.id],(err,result)=>{
          if(err)console.log(err);
          else{
              res.redirect("hr/hrManageEmployees");
          }
      })
  
  },
  viewProfilePage:(req,res)=>{
      pool.query("select * from EmployeeFull where employee_id=?",[req.params.id],(error,result)=>{
          if(error)console.log(error);
          else{
              console.log(req.session);
              res.render("viewProfile",{
                title:"View Profile",
                activeAdmin:"",
                activeCustomAttribute:" ",
                activeHR:true,
                active1:" ",
                activeProfile:"",
                activeEmployees:true,
                activeStatus:"",HR:result[0]})
          }
      })
  },

  editProfile:async(req,res)=>{
    const id=req.params.id;
    let {first_name,last_name,email,dob,mobile,landline,address,gender,marital_status,residency,emergency_first_name,emergency_last_name,emergency_address,emergency_mobile,emergency_landline,relationship}=req.body;
   
        
                await pool.query("call edit_profile(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",[id,first_name,email,gender,last_name,dob,marital_status,address,residency,mobile,landline,emergency_first_name,emergency_last_name,emergency_mobile,emergency_landline,relationship,emergency_address] ,(error,result)=>{
                   
                    if(error)console.log('Error in mysql', error);
                
                    else{
                       
                       
                        res.redirect("/hr/hrDashboard");}
                
          
      
    });
             
           
        
              
    
   
   


  

},
editProfilePage:(req,res)=>{
    pool.query("select * from EmployeeFull where employee_id=?;select * from custom_field; select * from paygrade;select * from job;select * from employment_status;select * from branch;select * from department;select distinct(employment_status)from employment_status;select * from role",[req.params.id],(error,result)=>{
        if(error)console.log(error);
        else{
            console.log(req.session);
           
            res.render("editProfile",{
               
                views:result,
                title:"View HR",
                activeAdmin:"",
                activeCustomAttribute:" ",
                activeHR:true,
                activeStatus:"",
                active1:" ",
                activeEmployees:"",
                HR:result[0][0], attributes:result[1],jobs:result[3],payGrades:result[2],employmentStatuses:result[4],branches:result[5],department:result[6],employmentStatusesU:result[7],role:result[8]
            })
        }
    })
},
hrApproveLeavesPage:(req,res)=>{

    
    var num=0;
    console.log(req.session.eid);
    if(req.session.role=="supervisor"){
    var query = `SELECT * FROM Employee_Leave_View where leave_status="0" and department_id=(select department_id from department where supervisor_id= "${req.params.id}");`
    }else if(req.session.role=="hr manager"){
        var query = `SELECT * FROM Employee_Leave_View where leave_status="0" and role_id=2 ;`
    }
    pool.query(query,(err,result)=>{
        if(err){
            res.send(err);
        }
        console.log(result);
        res.render("hrApproveLeaves",{
            active1:" "
            ,activeProfile:" "
            ,activeEmployees:" "
            ,employee_leave_count:result
            
            ,data1:""
            
        });

    });

},
hrApproveLeave:(req,res)=>{
    var id=req.params.id;
    var option=req.path.split("/")[2];
    if(option==="approve"){
        var query="UPDATE employee_leave_status SET leave_status='1' WHERE id='"+id+"'";
    }
    else if(option==="denied"){
        var query="UPDATE employee_leave_status SET leave_status= '2' WHERE id='"+id+"'";
    }
    
    
    pool.query(query,(err,result)=>{
        if(err) throw err;
        res.redirect(`/hr/hrApproveLeave/${id}`);
    });

},
applyLeavePage:(req,res)=>{
    res.render("applyLeave",{
        active1:"",activeEmployees:"",
    });
},
applyLeave:(req,res)=>{
    id=req.params.id;
    let {leave_title,start_date,end_date,day_count}=req.body;



    pool.query("insert into employee_leave_status(employee_id,leave_id,start_date,end_date,num_of_leaves) values(?,?,?,?,?)",[id,req.body.leave_title,req.body.start_date,req.body.end_date,req.body.day_count],(error,result)=>{
        if(error)console.log(error);
        else{
            res.redirect("/hr/hrDashboard");
        }
    })
}
}

