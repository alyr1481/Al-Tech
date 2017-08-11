var nodemailer = require('nodemailer');

// Node Mailer Send Live email
function sendServerLive(){
 var transporter = nodemailer.createTransport({
     service: 'Gmail',
     auth: {
         user: process.env.PERSONAL_GMAIL_ADDRESS,
         pass: process.env.PERSONAL_GMAIL_PASSWORD
     }
 });
 
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


module.exports = {
 sendServerLive: sendServerLive
};