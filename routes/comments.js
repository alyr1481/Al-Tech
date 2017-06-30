var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");
var Comment = require("../models/comments");


// Comments - Create
router.post("/", function(req,res){
  Post.findById(req.params.id, function(err,post){
    if (err){
      req.flash("error","Something Went Wrong!");
      res.redirect("/blogs");
    } else{
      Comment.create(req.body.comment, function(err,comment){
        if (err){
          console.log(err);
        } else{
          // add username and ID to comment
          //comment.author.id = req.user._id;
          //comment.author.username = req.user.username;
          // save comment
          comment.save();
          post.comments.push(comment);
          post.save();
          req.flash("success", "Succesfully Added Comment");
          res.redirect("/campgrounds/"+campground._id);
        }
      });
    }
  });
});
