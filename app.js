var local = 1 //Set to 0 if using C9

var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require('method-override'),
    Post = require('./models/posts');

var blogRoutes = require('./routes/blogs'),
    indexRoutes = require('./routes/index'),
    serviceRoutes = require('./routes/service');

// Mongoose Settings
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://192.168.1.118:32769/al-tech");
// mongoose.connect("mongodb://212.159.72.122:32769/al-tech");
// mongoose.connect("mongodb://localhost/al-tech");

// Express Settings
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

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
