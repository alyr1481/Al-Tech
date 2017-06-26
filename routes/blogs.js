
var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");
var multer = require("multer");

var storage =   multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/images/uploads');
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({ storage : storage}).single('imageFile');

//============
// Blog Routes
//============

// Index Page
router.get("/",function(req,res){
  Post.find({},function(err,posts){
    if(err){
      console.log("Error!!!" + err);
    } else{
      res.render("blogs/index",{posts: posts});
    }
  });
});


// New Posts Page
router.get("/new",function(req,res){
  res.render("blogs/new");
});

router.post("/",function(req,res){
  upload(req,res, function(err){
    if (err){
      return res.send("Error Uploading File");
    }
    if (typeof req.file !== "undefined"){
      var imageFile = '/images/uploads/' + req.file.filename;
      req.body.post.content = req.sanitize(req.body.post.content);
      req.body.post.imageFile = imageFile;
    }
    Post.create(req.body.post,function(err,post){
     if (err){
       console.log(err);
     } else {
       res.redirect("/blogs");
     }
   });
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
  Post.findById(req.params.id,function(err,foundPost){
    res.render("blogs/edit",{post:foundPost});
  });
});

router.put("/:id",function(req,res){
  upload(req,res, function(err){
    if (err){
      return res.send("Error Uplaoding File");
    }
    if (typeof req.file !== "undefined"){
      var imageFile = '/images/uploads/' + req.file.filename;
      req.body.post.content = req.sanitize(req.body.post.content);
      req.body.post.imageFile = imageFile;
    }
    Post.findByIdAndUpdate(req.params.id,req.body.post,function(err,post){
      if (err){
        console.log(error);
        res.redirect("back");
      } else{
        res.redirect("/blogs/"+post.id);
      }
    });
  });
});

// Delete Route
router.delete("/:id", function(req,res){
  Post.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    } else{
      res.redirect("/blogs");
    }
  });
});

module.exports = router;
