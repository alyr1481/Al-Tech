var local = 1 //Set to 0 if using C9

var express = require("express"),
    app = express(),
    mongoose = require('mongoose');

// Express Settings
app.set('view engine', 'ejs');

// Mongoose Settings
mongoose.connect("mongodb://localhost/al-tech");
mongoose.Promise = global.Promise;


app.get("/",function(req,res){
   res.render("index");
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
