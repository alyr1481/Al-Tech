var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");
var email = require("../email/emailSetup");
var ejs = require("ejs");
var User = require("../models/users");

// Render the Landing Page
router.get("/",function(req,res){
  res.render("index/landing");
});

// Render the Home page
router.get("/home",function(req,res){
 Post.find({}).populate("postType").exec(function(err,posts){
  if (err){
   console.log(err);
  } else{
   res.render("index/home",{posts: posts});
  }
 });
});

// Render the Contact Us Page
router.get("/contact",function(req,res){
 res.render("index/contact");
});

// Contact us Logic Route
router.post("/contact", function(req,res){
 ejs.renderFile("./views/emails/contactUs.ejs", {contact: req.body.contact, header: req.headers}, function (err, html){
  if (err){
   req.flash("error","An Error Occurred");
   return res.redirect("/contact");
  }
  email.sendContactUs(err,req.body.contact,html);
  if (err){
    req.flash("error","Something Went Wrong");
    return res.redirect("/home");
  }
  req.flash("success","Thanks for your message - somebody will be in touch shortly")
  return res.redirect("/home");
 });
});

router.get("/about", function(req,res){
  res.render("index/about");
});




module.exports = router;
