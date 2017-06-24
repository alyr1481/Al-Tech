var local = 1 //Set to 0 if using C9

var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressSanitizer = require("express-sanitizer"),
    Post = require('./models/posts');

var blogRoutes = require('./routes/blogs'),
    indexRoutes = require('./routes/index');

// Mongoose Settings
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/al-tech");

// Express Settings
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(expressSanitizer());



// Routes
app.use('/', indexRoutes);
app.use('/blogs', blogRoutes);


if (local){
  app.listen(3000,function(){
    console.log("SERVER HAS STARTED!");
  });
} else{
  app.listen(process.env.PORT, process.env.IP,function(){
    console.log("SERVER HAS STARTED!");
  });
}
