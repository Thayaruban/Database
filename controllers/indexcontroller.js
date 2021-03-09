//const session = require("express-session");
module.exports = {
    indexpage:(req,res)=>{
        console.log(req.session);
        res.render("index",{
           
        });
    },
    hrDashboard:(req,res)=>{
       ;
        res.render("hrDashboard",{
            active1:"active"
           ,activeProfile:" " 
           ,activeEmployees:" "
           
        });
    },
    error:(req,res)=>{
        res.send("NOT FOUND 404");
    }
};