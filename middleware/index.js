var Post = require("../models/posts");
var Comment = require("../models/comments");
var User = require("../models/users");
var ejs = require("ejs");
var fs = require("fs");
var crypto = require("crypto");
var email = require("../email/emailSetup");

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
      return next();
    }
    if (req.isAuthenticated() && req.user.isAdmin){
      return next();
    }
    req.flash("error","You Don't Have Permission to do that!");
    res.redirect("/blogs");
  });
};

// Checks User is Verified before loging in!
middlewareObj.isUserVerified = function(req,res,next){
  User.findOne({"username": req.body.username}, function(err,user){
    if (err || !user){
      return next();
    }
    if (user.verified){
      return next();
    }
    req.flash("error","Your account is not verified! - Resending Verification Email To Your Registered Email Address");
    crypto.randomBytes(20, function(err,buf){ // To generate a verification token
      var token = buf.toString('hex');
      user.verificationToken = token;
      user.save(function(err){
        if (err){
          console.log(err);
        }
      });
      ejs.renderFile("./views/emails/verifyAccount.ejs", {user: user, header: req.headers}, function (err, data){
        if (err){
          return console.log(err);
        }
        email.sendVerifyAccount(user, data);
      });
    });
    return res.redirect("/home");
  });
};

module.exports = middlewareObj;
