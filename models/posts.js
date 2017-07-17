var mongoose = require("mongoose");
var PostType = require("../models/postTypes");

var postSchema = new mongoose.Schema({
   title: String,
   imageFile: String,
   content: String,
   author: String,
   postType:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostType"
   },
   intro: String,
   imageURL: String,
      createdAt: { type: Date,
      default: Date.now
   },
   comments: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment"
     }
   ]
});

module.exports = mongoose.model("Post", postSchema);
