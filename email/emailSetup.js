var nodemailer = require('nodemailer');
var aws = require('aws-sdk');


var emailObj={};
var err;

aws.config.loadFromPath('aws_config.json')

var transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
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

// Password Reset Email
emailObj.sendPasswordReset = function sendPasswordReset(user, renderHTML){
 var mailOptions = {
  from: "'Password Reset' no-reply@al-tech.co.uk",
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

// Account Verify Setup
emailObj.sendVerifyAccount = function sendverifyAccount(user, renderHTML){
 var mailOptions = {
  from: "'Verify Account' no-reply@al-tech.co.uk",
  to: user.email,
  subject: "Verify Account - Al-Tech",
  html: renderHTML
 };

 transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
   return console.log(err);
  }
  console.log("New User Email Sent");
 });
}

// Contact Us Setup
emailObj.sendContactUs = function sendContactUs(err,contactForm, renderHTML){
 var mailOptions = {
  from: "Al-Tech Contact Form contact@al-tech.co.uk",
  to: "alyr1481@gmail.com",
  subject: "Al-Tech - Contact Form - " + contactForm.subject,
  html: renderHTML
 };

 transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
   return console.log(err);
  }
 });

}


module.exports = emailObj;
