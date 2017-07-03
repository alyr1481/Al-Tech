require('dotenv').config();

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    expressSanitizer = require("express-sanitizer"),
    flash = require("connect-flash"),
    passport = require('passport'),
    LocalStratergy = require('passport-local'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    // nodemailer = require('nodemailer'),
    Post = require('./models/posts'),
    PostType = require('./models/postTypes'),
    User = require("./models/users");

var blogRoutes = require('./routes/blogs'),
    indexRoutes = require('./routes/index'),
    adminRoutes = require('./routes/admin'),
    userRoutes = require('./routes/users'),
    commentRoutes = require('./routes/comments'),
    serviceRoutes = require('./routes/service');

// Mongoose Settings
mongoose.Promise = global.Promise;
if (process.env.LOCAL_OR_REMOTE==1){
 mongoose.connect(process.env.MONGO_LOCAL);
} else{
mongoose.connect(process.env.MONGO_REMOTE);
}

// Express Settings
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(flash());

// Passport Config
app.locals.moment = require('moment');
app.use(session({
  secret: 'Nozza is awesome!!',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/blogs', blogRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);

// Node Mailer Send Live email
// var transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: process.env.PERSONAL_GMAIL_ADDRESS,
//         pass: process.env.PERSONAL_GMAIL_PASSWORD
//     }
// });

// var mailOptions = {
//     from: 'hello@alyr.co.uk', // sender address
//     to: process.env.PERSONAL_GMAIL_ADDRESS, // list of receivers
//     subject: 'Al-Tech Server Has Started', // Subject line
//     text: 'Hello world ?', // plain text body
//     html: '<b>Hello world ?</b>' // html body
// };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log(error);
//     }
//     console.log('Message %s sent: %s', info.messageId, info.response);
// });


if (process.env.LOCAL_OR_REMOTE==1){
  app.listen(3000,function(){
    console.log("SERVER HAS STARTED!");
  });
} else{
  app.listen(process.env.PORT, process.env.IP,function(){
    console.log("SERVER HAS STARTED!");
  });
}
