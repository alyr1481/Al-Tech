require('dotenv').config();

var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");
var PostType = require("../models/postTypes");
var middleware = require("../middleware");
var fs = require("fs");
var AWS = require('aws-sdk');
var multer = require("multer");
var multerS3 = require('multer-s3');

// Multer and Amazon S3 Configuration
var s3 = new AWS.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'al-tech-images',
        region:"eu-west-2",
        key: function (req, file, cb) {
            //console.log(file);
            cb(null, Date.now() + file.originalname); //use Date.now() for unique file keys
        }
    })
});

//============
// Blog Routes
//============

// Index Page
router.get("/",function(req,res){
  Post.find({}).populate("postType").exec(function(err,posts){
    if(err){
      console.log("Error!!! " + err);
    } else{
      res.render("blogs/index",{posts: posts});
    }
  });
});


// New Posts Page
router.get("/new",middleware.isAdmin,function(req,res){
  PostType.find({},function(err,allpostTypes){
    if (err){
      console.log(err);
    } else {
      res.render("blogs/new",{allpostTypes: allpostTypes});
    }
  });
});

// Create Route
router.post("/",middleware.isAdmin,upload.array('imageFile',1), function(req,res,next){
  PostType.findOne({ 'name': req.body.post.postType },'_id name color icon',function(err,foundPostType){
    if (err){
      console.log(err);
    } else{
      req.body.post.postType=foundPostType._id;
      if (req.files.length > 0){
        req.body.post.imageFile="https://s3.eu-west-2.amazonaws.com/al-tech-images/"+req.files[0].key;
      }
      Post.create(req.body.post,function(err,post){
        if (err){
        console.log(err);
        } else {
        req.flash("success", "Post Successfully Added - "+post.title);
        res.redirect("/blogs");
        }
      });
    }
  });
});


// Show Page
router.get("/:id",function(req,res){
  Post.findById(req.params.id).populate("comments").exec(function(err,foundPost){
    if (err){
      res.render('errorPages/blogNotFound');
    } else{
      res.render("blogs/show",{post: foundPost});
    }
  });
});

// Edit Route
router.get("/:id/edit",middleware.isAdmin,function(req,res){
  Post.findById(req.params.id).populate("postType").exec(function(err,foundPost){
    PostType.find({},function(err,allpostTypes){
      res.render("blogs/edit",{post:foundPost, allpostTypes: allpostTypes});
    });
  });
});

// Update Route
router.put("/:id",middleware.isAdmin,upload.array('imageFile',1),function(req,res,next){
  console.log(req.body.post);
  PostType.findOne({ 'name': req.body.post.postType },'_id name color icon',function(err,foundPostType){
    if (err){
      console.log(err);
    } else{
      req.body.post.postType=foundPostType._id;
      if (req.files.length > 0){
        req.body.post.imageFile="https://s3.eu-west-2.amazonaws.com/al-tech-images/"+req.files[0].key;
      }
      req.body.post.postType=foundPostType._id;
      Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,post){
        if (err){
          console.log(err);
          res.redirect("back");
        } else{
          res.redirect("/blogs/"+post.id);
        }
      });
    }
  });
});


// Delete Route
router.delete("/:id", middleware.isAdmin,function(req,res){
  if (req.body.verify === req.body.postTitle){
    Post.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.redirect("/blogs");
      } else{
        res.redirect("/blogs");
      }
    });
  } else{
    req.flash("error", "Deletion Verification Failed");
    res.redirect("/blogs/"+req.params.id);
  }
});

router.get('*', function(req, res) {
    res.render('errorPages/notFound');
});

module.exports = router;
