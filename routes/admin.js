var express = require("express");
var router  = express.Router({mergeParams: true});
var PostType = require("../models/postTypes");

router.get("/",function(req,res){
  PostType.find({},function(err,postType){
    if (err){
      console.log(err);
    } else{
      res.render("admin/admin",{postType: postType});
    }
  });
});

router.post("/",function(req, res){
  PostType.create(req.body.postType, function(err, newlyCreated){
    if(err){
        req.flash("error", err.message);
        res.redirect("back");
    } else {
      res.redirect("/admin");
    }
  });
});

module.exports = router;
