var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
   title: String,
   image: String,
   content: String,
   author: String,
   postType: String,
   intro: String,
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
