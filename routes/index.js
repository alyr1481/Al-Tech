var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");``


router.get("/",function(req,res){
  res.render("landing");
});

router.get("/home",function(req,res){
 Post.find({}).populate("postType").exec(function(err,posts){
  if (err){
   console.log(err);
  } else{
   res.render("home",{posts: posts});
  }
 });
});

module.exports = router;
