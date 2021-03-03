
const isAdmin=(req, res, next) => {
    if (req.session.role=="admin") {
    
           next();
    }else{
           
            res.send(`You are not allowed`);
    
}
};

 


module.exports=isAdmin;

