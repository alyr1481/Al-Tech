require('dotenv').config();

var compression = require('compression'),
    express = require("express"),
    app = express(),
    minifyHTML = require('express-minify-html'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    expressSanitizer = require("express-sanitizer"),
    flash = require("connect-flash"),
    passport = require('passport'),
    LocalStratergy = require('passport-local'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    Post = require('./models/posts'),
    PostType = require('./models/postTypes'),
    User = require("./models/users"),
    email = require("./email/emailSetup");

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
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(flash());
app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));
var cacheTime = 86400000;     // 1 day
app.use(express.static(__dirname + '/public',{ maxAge: cacheTime }));

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
  res.locals.headers = req.headers;
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/blogs', blogRoutes);
app.use('/blogs/:id/comments', commentRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);

// Send Server Live Email
//email.sendServerLive();



// Page That Gets Loaded if cannot get the URL etc etc.
app.get('*', function(req, res) {
    res.render('errorPages/notFound');
});

if (process.env.LOCAL_OR_REMOTE==1){
  app.listen(3000,function(){
    console.log("SERVER HAS STARTED!");
  });
} else{
  app.listen(process.env.PORT, process.env.IP,function(){
    console.log("SERVER HAS STARTED!");
  });
}