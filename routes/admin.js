var express = require("express");
var router  = express.Router({mergeParams: true});
var PostType = require("../models/postTypes");
var middleware = require("../middleware");

// Root Admin Page
router.get("/", middleware.isAdmin,function(req,res){
  PostType.find({},function(err,postType){
    if (err){
      console.log(err);
    } else{
      res.render("admin/admin",{postType: postType});
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

module.exports = router;
