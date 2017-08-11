var express = require("express");
var router  = express.Router({mergeParams: true});
var passport = require('passport');
var User = require("../models/users");
var middleware = require("../middleware");
var AWS = require('aws-sdk');
var multer = require("multer");
var multerS3 = require('multer-s3');
var email = require("../email/emailSetup");
var ejs = require("ejs");
var fs = require("fs");

// Multer and Amazon S3 Configuration
var s3 = new AWS.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'al-tech-avatars',
        region:"eu-west-2",
        key: function (req, file, cb) {
            //console.log(file);
            cb(null, Date.now() + file.originalname); //use Date.now() for unique file keys
        }
    })
});

// ============
// Auth Routes
// ============

// Sign Up Logic
router.post("/register",function(req,res){
  if (req.body.password === req.body.confirmPassword){
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser,req.body.password, function(err, user){
      if (err){
        req.flash("error", err.message);
        console.log(err);
        req.flash("error",err);
        res.redirect("/");
      }
      passport.authenticate("local")(req,res, function (){
        req.flash("success", "Welcome to Al-Tech "+user.username);
        res.redirect("back");
      });
    });
  } else{
    req.flash("error", "Password's Do Not Match!");
    res.redirect("back");
  }
});

// Login Logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "back",
    failureRedirect: "/"
  }), function(req,res){
});

// Logout Logic
router.get("/logout",function(req,res){
  req.logout();
  req.flash("success","You Have Successfully Logged Out");
  res.redirect("/");
});

// User Profile Page
router.get("/profile/:id", middleware.isUserUser, function(req,res){
  User.findById(req.params.id, function(err,foundUser){
    if (err){
      res.render('errorPages/blogNotFound');
    } else{
      res.render("users/show",{user: foundUser});
    }
  });
});

// Update Avatar Route
router.put("/profile/:id",middleware.isUserUser,upload.array('imageFile',1),function(req,res,next){
  req.body.user.avatar="https://s3-eu-west-1.amazonaws.com/al-tech-avatars/"+req.files[0].key;
  User.findByIdAndUpdate(req.params.id,req.body.user,function(err,user){
    if (err){
      console.log(err);
      res.redirect("back");
    } else{
      res.redirect("/users/profile/"+user.id);
    }
  });
});

// Update Bio Route
router.put("/profile/:id/bio",middleware.isUserUser, function(req,res,next){
  User.findByIdAndUpdate(req.params.id,req.body.user,function(err,user){
    if (err){
      console.log(err);
      res.redirect("back");
    } else{
      res.redirect("/users/profile/"+user.id);
    }
  });
});

// ======================
// Change Password Routes
// ======================

// Change Password Route
router.put("/profile/:id/changepwd",middleware.isUserUser,function(req,res,next){
  User.findById(req.params.id, function(err,foundUser){
    if(err){
      console.log(err);
      req.flash("error","Something Went Wrong!");
      res.redirect("back");
    }else{
      if(req.body.user.password===req.body.user.passwordConfirm){
        foundUser.setPassword(req.body.user.password, function(){
          foundUser.save();
          req.flash("success","Password Changed Successfully");
          res.redirect("back");
        });
      }else{
        req.flash("error","Password's Don't Match!");
        res.redirect("back");
      }
    }
  });
});

// Forgotton Password Route
router.get("/forgottonpassword", function(req,res){
  res.render("users/forgottonPassword");
});

// Forgotton Password Post Route (Handles sendign the reset email etc)
router.post("/forgottonpassword",function(req,res){
  User.findOne({'email': req.body.user.email}, function(err,user){
    if (err || !user){
      console.log(err);
      req.flash("error","No User With That Email is Registered on Al-Tech");
      return res.redirect("/home");
    }
    // Change Password Bumf Needs to Go Here!
    ejs.renderFile("./views/emails/passwordReset.ejs", {user: user}, function (err, data){
      if (err){
        return console.log(err);
      }
      email.sendPasswordReset(user, data);
      req.flash("success","Please Follow Instructions in the Email you should Receive");
      res.redirect("/home");
    });
  });
});


// Error Catchall Page
router.get('*', function(req, res) {
    res.render('errorPages/notFound');
});

module.exports = router;
