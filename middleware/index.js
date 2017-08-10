var Post = require("../models/posts");
var Comment = require("../models/comments");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        // Does user own comment
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You Need to be Logged In to do That");
    res.redirect("back");
  }
};

// Checks if a User is Logged In
middlewareObj.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You Need to be Logged In to do That");
  res.redirect("back");
};

// Checks of Current User is an Admin
middlewareObj.isAdmin = function(req,res,next){
  if(req.isAuthenticated() && req.user.isAdmin){
    return next();
  }
  req.flash("error", "You Don't Have Permission to do that!");
  res.redirect("back");
};

// Checks That Requested User is indeed the logged in user
middlewareObj.isUserUser = function(req,res,next){
  if(req.isAuthenticated() && (req.params.id === req.user.id)){
    return next();
  }
  req.flash("error", "You Don't Have Permission to do that!");
  res.redirect("back");
};

// Checks if the post is live, if it isn't then it checks for admin
middlewareObj.isPostLive = function(req,res,next){
  Post.findById(req.params.id, function(err,foundPost){
    if (err){
      console.log(err);
      return res.render("back");
    }
    if (foundPost.status){
      console.log("2.5");
      return next();
    }
    if (req.isAuthenticated() && req.user.isAdmin){
      return next();
    }
    req.flash("error","You Don't Have Permission to do that!");
    res.redirect("/blogs");
  });
};

module.exports = middlewareObj;
