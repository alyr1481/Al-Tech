var express = require("express");
var router  = express.Router({mergeParams: true});
var PostType = require("../models/postTypes");
var User = require("../models/users");
var middleware = require("../middleware");
var passport = require('passport');

// Root Admin Page
router.get("/", middleware.isAdmin,function(req,res){
  PostType.find({},function(err,postType){
    if (err){
      console.log(err);
    } else{
      User.find({},function(err,user){
        if (err){
          console.log(err);
        }else{
          res.render("admin/admin",{postType: postType, user: user});
        }
      });
    }
  });
});

// Post-Type Post Route
router.post("/post-type", middleware.isAdmin,function(req, res){
  PostType.create(req.body.postType, function(err, newlyCreated){
    if(err){
        req.flash("error", err.message);
        res.redirect("back");
    } else {
      res.redirect("/admin");
    }
  });
});

// Post-Type Delete Route
router.delete("/post-type/:id", middleware.isAdmin, function(req,res){
    PostType.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/admin");
      } else{
        req.flash("success","Succesfully Removed")
        res.redirect("/admin");
      }
    });
});

// Post-Type Edit Route
router.put("/post-type/:id", middleware.isAdmin,function(req,res){
  PostType.findByIdAndUpdate(req.params.id,req.body.postType,function(err,post){
    if (err){
      console.log(err);
      res.redirect("back");
    } else{
      res.redirect("/admin");
    }
  });
});

// User Edit Route
router.put("/userupdate/:id", middleware.isAdmin,function(req,res){
  User.findByIdAndUpdate(req.params.id,req.body.user,function(err,user){
    if (err){
      console.log(err);
      res.redirect("back");
    } else{
      res.redirect("/admin");
    }
  });
});

// Delete User Route
router.delete("/userDelete/:id", middleware.isAdmin,function(req,res){
  User.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash("error",err);
      res.redirect("/admin");
    } else{
      req.flash("success","User Has Been Successfully Removed!");
      res.redirect("/admin");
    }
  });
});

// Add New User
router.post("/newuser",function(req,res){
  if (req.body.password === req.body.confirmPassword){
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser,req.body.password, function(err, user){
      if (err){
        req.flash("error", err.message);
        console.log(err);
        req.flash("error",err);
        res.redirect("/");
      }
      req.flash("success","New User Succesfully Added");
      res.redirect("/admin");
    });
  } else{
    req.flash("error", "Password's Do Not Match!");
    res.redirect("/admin");
  }
});

module.exports = router;
