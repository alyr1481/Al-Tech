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
    
    
    
    
app.listen(process.env.PORT, process.env.IP,function(){
  console.log("SERVER HAS STARTED!");
});    
    