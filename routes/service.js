var express = require("express");
var router  = express.Router({mergeParams: true});

//==============
// Service Routes
//==============

// Index Page
router.get("/",function(req,res){
  res.render("services/index");
});


module.exports = router;
