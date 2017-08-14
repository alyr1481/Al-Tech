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
var async = require("async");
var crypto = require("crypto");
var inlineCss = require('inline-css');
var juice = require('juice2');

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
    crypto.randomBytes(20, function(err,buf){ // To generate a verification token
      var token = buf.toString('hex');
      var newUser = new User({username: req.body.username, email: req.body.email, verificationToken: token});
      User.register(newUser,req.body.password, function(err, user){
        if (err){
          req.flash("error", err.message);
          console.log(err);
          req.flash("error",err);
          res.redirect("/");
        }
        // Render & Send Verification email
        ejs.renderFile("./views/emails/verifyAccount.ejs", {user: user}, function (err, data){
          if (err){
            return console.log(err);
          }
          email.sendVerifyAccount(user, data);
          req.flash("success","Please verify by clciking the link sent to "+req.body.email);
          res.redirect("/home");
        });
      });
    });
  } else{
    req.flash("error", "Password's Do Not Match!");
    res.redirect("back");
  }
});

// Verify router
router.get("/verify/:token",function(req,res){
  User.findOne({verificationToken: req.params.token}, function(err,user){
    if (err || !user){
      req.flash("success","You are already Verified");
      return res.redirect("/home");
    }
    user.verified=true;
    user.verificationToken=undefined;
    user.save(function(err){
      req.flash("success","Account Successfully Verified - Please Log In To Al-Tech");
      res.redirect("/home");
    });
    // Should We Auto Login People?
  });
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
    // Creates random Token
    crypto.randomBytes(20, function(err,buf){
      var token = buf.toString('hex');
      // Write token to DB
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 7200000; // 1 Hour
      // Generate Email EJS and Send to user
      ejs.renderFile("./views/emails/passwordReset.ejs", {user: user}, function (err, data){
        email.sendPasswordReset(user, data);
        req.flash("success","Please Follow Instructions in the Email you should Receive");
        res.redirect("/home");
      });
      user.save(function(err){
        if (err){
          console.log(err);
          req.flash("error", "Something Went Horribly Wrong!");
          res.redirect("/forgottonpassword");
        }
      });
    });
  });
});

router.get("/reset/:token",function(req,res){
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err,user){
    if (err || !user){
      req.flash("error","Password reset token is invalid or has expired");
      return res.redirect("/home");
    }
    res.render("users/resetPassword", {token: req.params.token})
  })
});

router.post("/reset/:token", function(req,res){
  if (req.body.user.password === req.body.user.passwordConfirm){
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err,user){
      if (err || !user){
        req.flash("error","Password reset token is invalid or has expired");
        return res.redirect("/home");
      }
      user.setPassword(req.body.user.password, function(err){
        if (err){
          console.log(err);
        }
        user.resetPasswordExpires=undefined;
        user.resetPasswordToken=undefined;
        user.save(function(err){
          req.flash("success","Password has been Successfully Changed");
          res.redirect("/home");
        })
      });
    });
  }else{
    req.flash("error", "Password's Don't Match!");
    res.redirect("/home");
  }
});


// Error Catchall Page
router.get('*', function(req, res) {
    res.render('errorPages/notFound');
});

module.exports = router;
