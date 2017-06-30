
var express = require("express");
var router  = express.Router({mergeParams: true});
var Post = require("../models/posts");
var PostType = require("../models/postTypes");
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
  PostType.find({},function(err,postType){
    if (err){
      console.log(err);
    } else {
      res.render("blogs/new",{postType: postType});
    }
  });
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
    
    PostType.findOne({ 'name': req.body.post.postType },'_id name color icon',function(err,foundPostType){
      if (err){
        console.log(err);
      } else{
        req.body.post.postType=foundPostType;
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
    PostType.find({},function(err,postType){
      res.render("blogs/edit",{post:foundPost, postType: postType});
    });  
  });
});

router.put("/:id",function(req,res){
  upload(req,res, function(err){
    if (err){
      return res.send("Error Uplaoding File");
    }
    if (typeof req.file !== "undefined" && req.body.post.imageFile){
      var imageFile = '/images/uploads/' + req.file.filename;
      //req.body.post.content = req.sanitize(req.body.post.content);
      req.body.post.imageFile = imageFile;
    }
    else{
      req.body.post.imagefile = "";
    }
    PostType.findOne({ 'name': req.body.post.postType },'_id name color icon',function(err,foundPostType){
      if (err){
        console.log(err);
      } else {
        req.body.post.postType=foundPostType;
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
