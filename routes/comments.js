var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");
var Comment = require("../models/comments");
var middleware = require("../middleware");


// Comments - Create
router.post("/", middleware.isLoggedIn,function(req,res){
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
          // comment.author.id = req.user._id;
          comment.username = req.user.username;
          comment.avatar = req.user.avatar;
          comment.users = req.user._id;
          // save comment
          comment.save();
          post.comments.push(comment);
          post.save();
          req.flash("success", "Succesfully Added Comment");
          res.redirect("/blogs/"+req.params.id);
        }
      });
    }
  });
});

router.get('*', function(req, res) {
    res.render('errorPages/notFound');
});

module.exports = router;
