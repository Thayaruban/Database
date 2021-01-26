module.exports ={
    hrAddEmployeesPage:(req,res)=>{
        res.render("hrAddemployees",{
            active1:" "
            ,activeProfile:" "
            ,activeEmployees:"active"
            
        });
    },
    hrManageEmployeesPage:(req,res)=>{
        res.render("hrManageEmployees",{
            active1:" "
            ,activeProfile:" "
            ,activeEmployees:"active"
            
        });
    },
    hrProfile:(req,res)=>{
        res.render("hrProfile",{
            active1:" "
            ,activeEmployees:" "
           ,activeProfile:"active"
           

        });
    },
}
