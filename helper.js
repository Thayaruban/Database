const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service:"gmail",
    
    auth: {
        user: 'littlelady2606@gmail.com', // generated ethereal user
        pass: '123thu1998'  // generated ethereal password
    }
  });

  


  module.exports=transporter;