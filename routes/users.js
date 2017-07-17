
var express = require("express");
var router  = express.Router({mergeParams: true});
var passport = require('passport');
var User = require("../models/users");


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
  // Give SES the details and let it construct the message for you.
  console.log("Sending Email");

  req.logout();
  req.flash("success","You Have Successfully Logged Out");
  res.redirect("/");
});

router.get('*', function(req, res) {
    res.render('errorPages/notFound');
});

module.exports = router;
