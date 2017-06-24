
var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");

//============
// Blog Routes
//============

// Index Page
router.get("/",function(req,res){
  Post.find({},function(err,posts){
    if(err){
      console.log("Error!!!" + err);
    } else{
      res.render("index",{posts: posts});
    }
  });
});


// New Posts Page
router.get("/new",function(req,res){
  res.render("new");
});

router.post("/",function(req,res){
  req.body.post.content = req.sanitize(req.body.post.content);
  Post.create(req.body.post,function(err,post){
   if (err){
     console.log(err);
   } else {
     res.redirect("/blogs");
   }
 });
});


// Show Page
router.get("/:id",function(req,res){
  Post.findById(req.params.id,function(err,foundPost){
    if (err){
      console.log(err);
    } else{
      res.render("show",{post: foundPost});
    }
  });
});

// Edit Page
router.get("/:id/edit",function(req,res){
  Post.findById(req.params.id,function(err,foundPost){
    res.render("edit",{post:foundPost});
  });
});

router.put("/:id",function(req,res){
  Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,post){
    if (err){
      console.log(error);
      res.redirect("back");
    } else{
      res.redirect("/blogs/"+post.id);
    }
  });
});


module.exports = router;
