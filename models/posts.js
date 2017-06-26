var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
   title: String,
   imageFile: String,
   content: String,
   author: String,
   postType: String,
   intro: String,
   imageURL: String,
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
