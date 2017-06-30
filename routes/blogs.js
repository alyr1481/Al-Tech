require('dotenv').config();

var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");
var PostType = require("../models/postTypes");
var fs = require("fs");
var AWS = require('aws-sdk');
var multer = require("multer");
var multerS3 = require('multer-s3');

// Multer and Amazon S3 Configuration
//AWS.config.loadFromPath('./s3_config.json');
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
router.get("/new",function(req,res){
  PostType.find({},function(err,allpostTypes){
    if (err){
      console.log(err);
    } else {
      res.render("blogs/new",{allpostTypes: allpostTypes});
    }
  });
});

router.post("/",upload.array('imageFile',1), function(req,res,next){
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
  Post.findById(req.params.id,function(err,foundPost){
    if (err){
      console.log(err);
    } else{
      res.render("blogs/show",{post: foundPost});
    }
  });
});

// Edit Page
router.get("/:id/edit",function(req,res){
  Post.findById(req.params.id).populate("postType").exec(function(err,foundPost){
    PostType.find({},function(err,allpostTypes){
      res.render("blogs/edit",{post:foundPost, allpostTypes: allpostTypes});
    });
  });
});

router.put("/:id",upload.array('imageFile',1),function(req,res,next){
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
router.delete("/:id", function(req,res){
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

module.exports = router;
