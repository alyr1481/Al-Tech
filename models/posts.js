var mongoose = require("mongoose");
var PostType = require("../models/postTypes");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var postSchema = new mongoose.Schema({
   title: String,
   imageFile: String,
   content: String,
   author: String,
   status: {type: Boolean, default: false},
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

postSchema.plugin(deepPopulate);

module.exports = mongoose.model("Post", postSchema);
