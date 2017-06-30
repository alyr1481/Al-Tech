var mongoose = require("mongoose");
var PostType = require("../models/postTypes");

var postSchema = new mongoose.Schema({
   title: String,
   imageFile: String,
   content: String,
   author: String,
   postType: {
      id: String,
      name: String,
      color: String,
      icon: String
   },   
   intro: String,
   imageURL: String,
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
