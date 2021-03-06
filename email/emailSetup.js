var nodemailer = require('nodemailer');
var aws = require('aws-sdk');
var ses = require('nodemailer-ses-transport');


var emailObj={};
var err;

// Connect to AWS service and check credentials
var transporter = nodemailer.createTransport(ses({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION
}));

// Send Server is Live email
emailObj.sendServerLive = function sendServerLive(){
 var mailOptions = {
     from: 'hello@alyr.co.uk', // sender address
     to: process.env.PERSONAL_GMAIL_ADDRESS, // list of receivers
     subject: 'Al-Tech Server Has Started', // Subject line
     text: 'Hello world ?', // plain text body
     html: '<b>Hello world ?</b>' // html body
 };

sendEmail(mailOptions);
};

// Send Test Email
emailObj.sendTestEmail = function sendTestEmail(recipient,from,subject,content){
    var mailOptions = {
        from: from,
        to: recipient,
        subject: subject,
        html: content
    };
    sendEmail(mailOptions)
}

// Password Reset Email
emailObj.sendPasswordReset = function sendPasswordReset(user, renderHTML){
 var mailOptions = {
  from: "'Password Reset' no-reply@al-tech.co.uk",
  to: user.email,
  subject: "Password Reset For Al-Tech",
  html: renderHTML
 };

sendEmail(mailOptions);
}

// Account Verify Setup
emailObj.sendVerifyAccount = function sendverifyAccount(user, renderHTML){
 var mailOptions = {
  from: "'Verify Account' no-reply@al-tech.co.uk",
  to: user.email,
  subject: "Verify Account - Al-Tech",
  html: renderHTML
 };

 sendEmail(mailOptions);
}

// Contact Us Setup
emailObj.sendContactUs = function sendContactUs(err,contactForm, renderHTML){
 var mailOptions = {
  from: "Al-Tech Contact Form contact@al-tech.co.uk",
  to: "alyr1481@gmail.com",
  subject: "Al-Tech - Contact Form - " + contactForm.subject,
  html: renderHTML
 };

sendEmail(mailOptions);
}


// Function to send Email
function sendEmail(mailOptions){
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports = emailObj;
