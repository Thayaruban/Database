//const session = require("express-session");
module.exports = {
    indexpage:(req,res)=>{
        res.render("index",{
           
        });
    },
    hrDashboard:(req,res)=>{
        req.session.user=" ";
        req.session.user.type="Hr";
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