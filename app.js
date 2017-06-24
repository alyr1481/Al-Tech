var local = 1 //Set to 0 if using C9

var express = require("express"),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Post = require('./models/posts');

// Express Settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose Settings
mongoose.connect("mongodb://localhost/al-tech");
//mongoose.Promise = global.Promise;

// Root Page
app.get("/",function(req,res){
   res.render("index");
});

// Posts Page
app.get("/posts",function(req,res){
   res.render("index");
});

// New Posts Page
app.get("/posts/new",function(req,res){
  res.render("new");
});

app.post("/posts",function(req,res){;
  Post.create(req.body.post,function(err,post){
   if (err){
     console.log(err);
   } else {
     res.redirect("/posts");
   }
 });
});


if (local){
  app.listen(3000,function(){
    console.log("SERVER HAS STARTED!");
  });
} else{
  app.listen(process.env.PORT, process.env.IP,function(){
    console.log("SERVER HAS STARTED!");
  });
}
