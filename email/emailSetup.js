var nodemailer = require('nodemailer');

var emailObj={};

// Transporter Setup for the service used. (Gmail).
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.PERSONAL_GMAIL_ADDRESS,
        pass: process.env.PERSONAL_GMAIL_PASSWORD
    }
});

// Send Server is Live email
emailObj.sendServerLive = function sendServerLive(){
 var mailOptions = {
     from: 'hello@alyr.co.uk', // sender address
     to: process.env.PERSONAL_GMAIL_ADDRESS, // list of receivers
     subject: 'Al-Tech Server Has Started', // Subject line
     text: 'Hello world ?', // plain text body
     html: '<b>Hello world ?</b>' // html body
 };
 
 transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
   return console.log(err);
  }
  console.log("Sending Server Start Email");
 });
};

emailObj.sendPasswordReset = function sendPasswordReset(user, renderHTML){
 var mailOptions = {
  from: "'Password Reset' hello@al-tech.co.uk",
  to: user.email,
  subject: "Password Reset For Al-Tech",
  html: renderHTML
 };
 
 transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
   return console.log(err);
  }
 });
}


module.exports = emailObj;