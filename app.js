var local = 0 //Set to 0 if using C9
require('dotenv').config();

var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require("connect-flash"),
    Post = require('./models/posts');

var blogRoutes = require('./routes/blogs'),
    indexRoutes = require('./routes/index'),
    serviceRoutes = require('./routes/service');

// Mongoose Settings
mongoose.Promise = global.Promise;
if (local){
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

app.use(session({
  secret: 'Nozza is awesome!!',
  resave: false,
  saveUninitialized: false
}));

app.use(function(req,res,next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/blogs', blogRoutes);
app.use('/services', serviceRoutes);


if (local){
  app.listen(3000,function(){
    console.log("SERVER HAS STARTED!");
  });
} else{
  app.listen(process.env.PORT, process.env.IP,function(){
    console.log("SERVER HAS STARTED!");
  });
}
