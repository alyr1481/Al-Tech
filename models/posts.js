var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
   title: String,
   image: String,
   content: String,
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
